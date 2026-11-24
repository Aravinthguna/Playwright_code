class ApiUtils {

    async loginReturn(request, phone, pin, apiUrl = 'https://devapi-office.realiti.tech') {
        const loginPayLoad = {
            mobile: phone,
            passPin: pin
        };

        const loginHeader = {
            "X-Internal-Key": '861FE1D7ED5293E63D0B57F1879C7160',
        };

        const targetUrl = apiUrl.endsWith('/account/v1/user/signin')
            ? apiUrl
            : `${apiUrl.replace(/\/$/, '')}/account/v1/user/signin`;

        const loginResponse = await request.post(
            targetUrl,
            {
                data: loginPayLoad,
                headers: loginHeader,
                timeout: 15000
            }
        );

        if (!loginResponse.ok()) {
            throw new Error(
                `Login API HTTP failed (${loginResponse.status()} ${loginResponse.statusText()}) at ${targetUrl}\n` +
                `Phone: ${phone}`
            );
        }

        const loginJsonResponse = await loginResponse.json();

        // Check for application-level error inside the JSON response (e.g. 401 Invalid credentials)
        if (loginJsonResponse.status?.code && String(loginJsonResponse.status.code) !== "200") {
            const errorMsg = loginJsonResponse.status.message || loginJsonResponse.status.description || loginJsonResponse.data?.users?.message || 'Login failed';
            throw new Error(`Login API failed (${loginJsonResponse.status.code}: ${errorMsg}) for phone: ${phone}`);
        }

        const session = loginJsonResponse.data?.users?.sessionId;
        const userUuid = loginJsonResponse.data?.users?.userUuid;

        if (!session) {
            throw new Error(`Login API response did not contain sessionId: ${JSON.stringify(loginJsonResponse)}`);
        }

        console.log(` Login successful (${targetUrl}). Session: ${String(session).substring(0, 8)}... | User: ${userUuid}`);
        return { session, userUuid };
    }

    /**
     * Helper to create an authenticated browser page using session cookie based on environment configuration.
     * Can be called as:
     *   createAuthenticatedPage(browser, request, CURRENT_ENV)
     *   or createAuthenticatedPage(browser, request, phone, pin, CURRENT_ENV)
     * @param {import('@playwright/test').Browser} browser 
     * @param {import('@playwright/test').APIRequestContext} request 
     * @param {Object|string} envConfigOrPhone Environment object OR phone string
     * @param {string} [optionalPin] Optional pin string if phone was passed
     * @param {Object} [optionalEnvConfig] Environment object if phone and pin were passed
     */
    async createAuthenticatedPage(browser, request, envConfigOrPhone, optionalPin, optionalEnvConfig) {
        let envConfig, phone, pin;
        if (typeof envConfigOrPhone === 'object' && envConfigOrPhone !== null) {
            envConfig = envConfigOrPhone;
            phone = envConfig.phone || '7760279160';
            pin = envConfig.pin || 'no1234';
        } else {
            phone = envConfigOrPhone;
            pin = optionalPin;
            envConfig = optionalEnvConfig;
        }

        if (!envConfig) {
            const { ENVS, ENV_INDEX } = require('../config/env.config');
            envConfig = ENVS[ENV_INDEX];
        }

        let sessionToken;
        try {
            const loginReturn = await this.loginReturn(
                request,
                phone || envConfig.phone,
                pin || envConfig.pin,
                envConfig.apiUrl || envConfig.baseUrl
            );
            sessionToken = loginReturn.session;
        } catch (err) {
            if (envConfig && envConfig.sessionId) {
                console.warn(`[Auth] API login failed (${err.message}). Falling back to configured sessionId token.`);
                sessionToken = envConfig.sessionId;
            } else {
                throw err;
            }
        }

        const storageContext = await browser.newContext({
            storageState: {
                cookies: [
                    {
                        name: "ri_s_id",
                        value: `${sessionToken}`,
                        domain: envConfig.cookieDomain,
                        path: "/",
                        httpOnly: true,
                        secure: true,
                        sameSite: "None",
                    },
                ],
            },
        });
        return await storageContext.newPage();
    }

}
module.exports = { ApiUtils }