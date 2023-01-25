export class DiscordUtil {
    static httpClient: any;

    static DiscordConstants = {
        CLIENT_ID: "1010001099815669811",
        CLIENT_SECRET: "",
        TOKEN_ENDPOINT: "https://discord.com/api/oauth2/token",
        OAUTH_IDENTITY_ENDPOINT: "https://discord.com/api/oauth2/@me",
        IDENTITY_ENDPOINT: "https://discord.com/api/v10/users/@me",

        USERNAME_AUTHZ_CODE: "authz_code",
        USERNAME_CACHED_TOKEN: "cached_token"
    }

    static DiscordInfo = {
        username: '',
        password: '',
        token: ''
    }

    static AccessTokenResponse = {
        access_token: ''
    }

    static UserResponse = {
        id: '',
        username: '',
        discriminator: ''
    }

    static async getAccessToken(code: string): Promise<AccessTokenResponse> {
        let formBody = new FormData();
        formBody.append("client_id", DiscordUtil.DiscordConstants.CLIENT_ID);
        formBody.append("client_secret", DiscordUtil.DiscordConstants.CLIENT_SECRET);
        formBody.append("grant_type", "authorization_code");
        formBody.append("code", code);
        formBody.append("redirect_uri", "http://localhost:8080");

        let response = await fetch(DiscordUtil.DiscordConstants.TOKEN_ENDPOINT, {
            method: 'POST',
            body: formBody
        });
        let resp = await response.json();
        return resp;
    }

    static async getUserInfo(token: string): Promise<UserResponse> {
        let response = await fetch(DiscordUtil.DiscordConstants.IDENTITY_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        let resp = await response.json();
        return resp;
    }

    static async isTokenValid(token: string): Promise<boolean> {
        let response = await fetch(DiscordUtil.DiscordConstants.OAUTH_IDENTITY_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
        return response.ok;
    }

    static async getDiscordInfoWithCode(code: string): Promise<DiscordInfo> {
        let token = await getAccessToken(code);
        return getDiscordInfoWithToken(token.access_token);
    }

    static async getDiscordInfoWithToken(token: string): Promise<DiscordInfo> {
        let userInfo = await getUserInfo(token);

        let ret = new DiscordInfo();
        ret.username = userInfo.username + "_" + userInfo.discriminator;
        ret.password = uuidv4();
        ret.token = token;

        return ret;
    }

}
