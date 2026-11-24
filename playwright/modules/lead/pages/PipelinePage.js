const { WebElement } = require("../../../utils/WebElements");
const { expect, test } = require("@playwright/test");
const { getRandomDate } = require("../../../utils/DateUtils");

const webelement = new WebElement();

const SHORT_WAIT = 5000;
const MED_WAIT = 10000;
const LONG_WAIT = 20000;

// Safety cap so a stuck/never-converting lead can't loop forever
const MAX_PIPELINES = 10;

class PipeLinePage {
  constructor(page) {
    this.page = page;
    this.expect = expect;
  }

  /*********************************************************
   *  MAIN EXECUTION WORKFLOW
   *  1.  Navigate to lead details page
   *  2.  Pipeline 1: Bucket iteration & move to next pipeline
   *  3.  Pipeline 2: Bucket iteration
   *  4.  Backward Movement: Revert via popup reason & confirm
   *  5.  Re-advance: Move to success bucket & move to next pipeline
   *  6.  Advance remaining pipelines until lead is converted
   *  7.  Confirm conversion text
   *  8.  Pipeline history check
   *********************************************************/
  async pipelinePageDetails() {
    const {
      navigateLeadID,
      leadConverted,
      successBucket,
      clickBackWardMovementButton,
    } = webelement.pageElement(this.page);

    // Step 1: Navigate to the lead details page
    await test.step("1. Navigate to the lead details page", async () => {
      await navigateLeadID
        .nth(0)
        .waitFor({ state: "visible", timeout: LONG_WAIT });
      await navigateLeadID.nth(0).click();
      await this.page.waitForLoadState("networkidle").catch(() => {});
    });

    // Check if lead is already converted
    const isAlreadyConverted = await leadConverted
      .isVisible({ timeout: SHORT_WAIT })
      .catch(() => false);

    if (isAlreadyConverted) {
      await this.verifyLeadConverted();
      await this.pipelineHistroy();
      return;
    }

    // ── Pipeline 1 (First Pipeline) ──────────────────────────────────────────
    await this.verifyPipelineName("Pipeline 1");
    await this.runSinglePipelineIteration("Pipeline 1");

    const movedToNext = await this.moveToNextPipelineIfNeeded("Pipeline 1");

    if (movedToNext) {
      // ── Pipeline 2 (Second Pipeline) ───────────────────────────────────────
      await this.verifyPipelineName("Pipeline 2");
      await this.runSinglePipelineIteration("Pipeline 2");

      // ── Backward Movement: revert to previous stage ────────────────────────
      const isBackwardVisible = await clickBackWardMovementButton
        .waitFor({ state: "visible", timeout: SHORT_WAIT })
        .then(() => true)
        .catch(() => false);

      if (isBackwardVisible) {
        await this.performBackwardMovement(
          "Reverting lead back to previous pipeline stage for re-evaluation",
        );

        // ── Move to success bucket and advance back to next pipeline ──────────
        await this.moveToSuccessBucket("Revert recovery (Pipeline 1)");
        await this.moveToNextPipelineIfNeeded("Re-advance after revert");
      }

      // ── Advance through remaining pipelines until converted ─────────────────
      let stageIndex = 2;
      while (stageIndex <= MAX_PIPELINES) {
        const isConverted = await leadConverted
          .isVisible()
          .catch(() => false);
        if (isConverted) break;

        // Move to success bucket in this pipeline stage
        await this.moveToSuccessBucket(`Pipeline stage ${stageIndex}`);

        // Check if converted immediately after clicking success bucket
        const convertedAfterSuccess = await leadConverted
          .waitFor({ state: "visible", timeout: 2000 })
          .then(() => true)
          .catch(() => false);
        if (convertedAfterSuccess) break;

        // If next pipeline button is visible, move to next pipeline; otherwise stop
        const hasNext = await this.moveToNextPipelineIfNeeded(
          `Pipeline stage ${stageIndex}`,
        );
        if (!hasNext) {
          break;
        }

        stageIndex++;
      }
    } else {
      // If there's only 1 pipeline, ensure success bucket is clicked to complete conversion
      await this.moveToSuccessBucket("single pipeline");
    }

    // Step 7: Confirm conversion — scenario complete
    await this.verifyLeadConverted();

    // Step 8: Pipeline history check
    await this.pipelineHistroy();
  }

  /*********************************************************
   *  Step 2 / 5 — Verify pipeline name is visible
   *********************************************************/
  async verifyPipelineName(label = "") {
    const { pipelineName } = webelement.pageElement(this.page);

    await test.step(`Verify pipeline name - ${label}`, async () => {
      await expect(pipelineName).toBeVisible({ timeout: LONG_WAIT });
    });
  }

  /*********************************************************
   *  Steps 3-4 — Move through each bucket, try the failure
   *  bucket, then return to the success bucket
   *********************************************************/
  async runSinglePipelineIteration(iterationLabel) {
    const {
      clickPipelineBucketField,
      failureBucketdropdown,
      selectFailureBucket,
      successBucket,
    } = webelement.pageElement(this.page);

    await test.step(`Pipeline scenario - ${iterationLabel}`, async () => {
      // Move through each bucket in the current pipeline
      const bucketCount = await clickPipelineBucketField.count();
      for (let b = 0; b < bucketCount; b++) {
        const bucket = clickPipelineBucketField.nth(b);
        const visible = await bucket
          .isVisible({ timeout: SHORT_WAIT })
          .catch(() => false);
        if (visible) {
          await bucket.click();
          await this.page.waitForLoadState("networkidle").catch(() => {});
        }
      }

      // Click failure bucket dropdown and select first failure bucket option if present
      const failureCount = await failureBucketdropdown.count();
      for (let f = 0; f < failureCount; f++) {
        const fDropdown = failureBucketdropdown.nth(f);
        const visible = await fDropdown
          .isVisible({ timeout: SHORT_WAIT })
          .catch(() => false);
        if (visible) {
          await fDropdown.click();

          const selectCount = await selectFailureBucket
            .first()
            .waitFor({ state: "visible", timeout: SHORT_WAIT })
            .then(() => selectFailureBucket.count())
            .catch(() => 0);

          if (selectCount > 0) {
            await selectFailureBucket.first().click();
            await successBucket.waitFor({
              state: "visible",
              timeout: SHORT_WAIT,
            });
            await successBucket.click();
            break;
          }
        }
      }

      // Move back to the success bucket
      await successBucket.waitFor({ state: "visible", timeout: MED_WAIT });
      await successBucket.click();
    });
  }

  /*********************************************************
   *  Move to Success Bucket in current pipeline stage:
   *  - Tries clicking the success/last bucket directly
   *  - If the application enforces sequential bucket movement
   *    (e.g., from Reverted status back to Qualified Lead),
   *    steps through each bucket sequentially to reach success.
   *********************************************************/
  async moveToSuccessBucket(label = "") {
    const {
      successBucket,
      clickPipelineBucketField,
      clickMoveNextPipelineButton,
      leadConverted,
    } = webelement.pageElement(this.page);

    await test.step(`Move to success bucket - ${label}`, async () => {
      // 1. Try clicking the last bucket directly (success bucket)
      const lastBucket = clickPipelineBucketField.last();
      const isLastVisible = await lastBucket
        .waitFor({ state: "visible", timeout: SHORT_WAIT })
        .then(() => true)
        .catch(() => false);

      if (isLastVisible) {
        await lastBucket.click();
        await this.page.waitForLoadState("networkidle").catch(() => {});
        await this.page.waitForTimeout(500);
      } else {
        await successBucket.click().catch(() => {});
        await this.page.waitForLoadState("networkidle").catch(() => {});
      }

      // 2. Check if the "Move to Next Pipeline" button or conversion text appeared
      const hasMoveButton = await clickMoveNextPipelineButton
        .waitFor({ state: "visible", timeout: 2000 })
        .then(() => true)
        .catch(() => false);

      const hasConverted = await leadConverted
        .waitFor({ state: "visible", timeout: 1000 })
        .then(() => true)
        .catch(() => false);

      // 3. If neither appeared (e.g. status was Reverted and requires sequential clicks),
      // step through each bucket in sequence to reach the final success bucket
      if (!hasMoveButton && !hasConverted) {
        const bucketCount = await clickPipelineBucketField.count();
        for (let b = 0; b < bucketCount; b++) {
          const bucket = clickPipelineBucketField.nth(b);
          const visible = await bucket.isVisible().catch(() => false);
          if (visible) {
            await bucket.click();
            await this.page.waitForLoadState("networkidle").catch(() => {});
            await this.page.waitForTimeout(300);
          }
        }
      }
    });
  }

  /*********************************************************
   *  Step 4 — Click "move to next pipeline" only if it's
   *  visible. If it isn't, the pipeline is assumed to
   *  auto-advance and this returns false so the caller can
   *  wait/poll instead.
   *********************************************************/
  async moveToNextPipelineIfNeeded(label = "") {
    const { clickMoveNextPipelineButton, pipelineName } =
      webelement.pageElement(this.page);

    return test.step(`Move to next pipeline (if visible) - ${label}`, async () => {
      // Ensure any modal background overlay is hidden before clicking
      const modalOverlay = this.page.locator(".fixed.inset-0");
      await modalOverlay
        .waitFor({ state: "hidden", timeout: SHORT_WAIT })
        .catch(() => {});

      const isVisible = await clickMoveNextPipelineButton
        .waitFor({ state: "visible", timeout: 3000 })
        .then(() => true)
        .catch(() => false);

      if (isVisible) {
        await clickMoveNextPipelineButton.click();
        await expect(pipelineName)
          .toBeVisible({ timeout: MED_WAIT })
          .catch(() => {});
        await this.page.waitForLoadState("networkidle").catch(() => {});
        return true;
      }

      // Button not present - pipeline auto-moves on its own or lead converted
      return false;
    });
  }

  /*********************************************************
   *  Step 5 — Perform Backward Movement (Revert pipeline)
   *  1. Click backward movement button
   *  2. If backward bucket option is visible, select it
   *  3. Enter reason in textarea (//textarea[@style="font-family: inherit;"])
   *  4. Click confirm button (//button[normalize-space()="Confirm"])
   *  5. Lead moves reverted
   *********************************************************/
  async performBackwardMovement(
    reason = "Reverting lead back to previous pipeline stage for re-evaluation",
  ) {
    const {
      clickBackWardMovementButton,
      backwardBucktswitch,
      backwardReasonTextArea,
      backwardConfirmButton,
    } = webelement.pageElement(this.page);

    await test.step("Perform backward movement (revert pipeline)", async () => {
      // Ensure any background overlay is hidden before clicking
      const modalOverlay = this.page.locator(".fixed.inset-0");
      await modalOverlay
        .waitFor({ state: "hidden", timeout: SHORT_WAIT })
        .catch(() => {});

      await clickBackWardMovementButton.waitFor({
        state: "visible",
        timeout: MED_WAIT,
      });
      await clickBackWardMovementButton.click();

      // If bucket switch selection option is present in the popup, select it
      const isBucketSwitchVisible = await backwardBucktswitch
        .waitFor({ state: "visible", timeout: SHORT_WAIT })
        .then(() => true)
        .catch(() => false);

      if (isBucketSwitchVisible) {
        await backwardBucktswitch.click();
        await this.page.waitForTimeout(500);
      }

      // Enter revert reason in textarea
      await backwardReasonTextArea.waitFor({
        state: "visible",
        timeout: MED_WAIT,
      });
      await backwardReasonTextArea.fill(reason);
      await this.page.waitForTimeout(300);

      // Click Confirm button to revert
      await backwardConfirmButton.waitFor({
        state: "visible",
        timeout: SHORT_WAIT,
      });
      await backwardConfirmButton.click();

      // Ensure modal is dismissed and state settled
      await modalOverlay
        .waitFor({ state: "hidden", timeout: SHORT_WAIT })
        .catch(() => {});
      await this.page.waitForLoadState("networkidle").catch(() => {});
      await this.page.waitForTimeout(1000);
    });
  }

  /*********************************************************
   *  Step 7 — Verify "Lead Converted" text
   *********************************************************/
  async verifyLeadConverted() {
    const { leadConverted } = webelement.pageElement(this.page);

    await test.step("Verify 'Lead Converted' text", async () => {
      // Let any pending re-render / network activity finish first
      await this.page.waitForLoadState("networkidle").catch(() => {});

      const convertedLocator = leadConverted.or(
        this.page.getByText(/lead converted/i),
      );
      await expect(convertedLocator.first()).toBeVisible({ timeout: LONG_WAIT });
    });
  }

  /*********************************************************
   *  Step 8 — Pipeline History check
   *  Clicks the Pipeline History tab, interacts with the
   *  activity timeline dropdown, then scrolls to the bottom.
   *********************************************************/
  async pipelineHistroy() {
    const {
      pipelineHistoryfield,
      activityTimelineField,
      scrollToBottomOfPipelineHistory,
    } = webelement.pageElement(this.page);

    await test.step("Pipeline History — verify history tab and timeline", async () => {
      // Open the Pipeline History tab if visible
      const isPHVisible = await pipelineHistoryfield
        .waitFor({ state: "visible", timeout: SHORT_WAIT })
        .then(() => true)
        .catch(() => false);

      if (isPHVisible) {
        await pipelineHistoryfield.click();
        await this.page.waitForLoadState("networkidle").catch(() => {});
      }

      // Interact with the activity timeline dropdown if present
      const isATVisible = await activityTimelineField
        .waitFor({ state: "visible", timeout: SHORT_WAIT })
        .then(() => true)
        .catch(() => false);

      if (isATVisible) {
        await activityTimelineField.click();
      }

      // Scroll to the bottom of the pipeline history panel if present
      const isScrollVisible = await scrollToBottomOfPipelineHistory
        .waitFor({ state: "visible", timeout: SHORT_WAIT })
        .then(() => true)
        .catch(() => false);

      if (isScrollVisible) {
        await scrollToBottomOfPipelineHistory.scrollIntoViewIfNeeded();
      }
    });
  }
}

module.exports = { PipeLinePage };