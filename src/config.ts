import * as config from "config";

interface IConfig {
    homeserverUrl: string;
    accessToken: string;
    acceptedInviteUsers: string[];
    dataPath: string;
    listen: {
        addr: string;
        port: number;
        user: string;
        pass: string;
    }
}

export default <IConfig>config;
