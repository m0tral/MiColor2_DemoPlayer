import app from '@system.app';
import router from '@system.router';
import network from '@system.network';
import fetch from '@system.fetch';
import file from '@system.file';
import dev from '@system.device';
import config from '../../common/config.js';

const URI_DIRLIST = "internal://app/albumList.txt";
const APP_DIR = "app.player";

export default {
    data: {
        isWifiAvailable: false,
        show_sync: true,
        baseUrl: config.SERVER_HTTP,
        request_get_directory: "/"+ APP_DIR +"/dir.php",
        sn: "",
    },

    onInit() {

        dev.getInfo({
            success: (options) => {
                this.sn = options.IMEI;
            }
        });

        network.subscribe({
            type: "WIFI",
            callback: (e) => {
                this.isWifiAvailable = e;
                this.loadRemoteList();
            },
        });
    },

    onHide() {
        network.unsubscribe({type: "WIFI"});
    },

    loadRemoteList() {

        if (this.isWifiAvailable) {

            fetch.fetch({
                url: this.baseUrl + this.request_get_directory +"?sn="+ this.sn,
                method: "GET",
                header: { "User-Agent": config.USER_AGENT },
                success: (e) => {

                    let jsonText = JSON.stringify(e.data);

                    file.writeText({
                        uri: URI_DIRLIST,
                        text: jsonText,
                        complete: (e) => {
                            router.replace({
                                uri: "pages/network/index",
                                params: { src: this.sn }
                            });
                        }
                    });
                },
            });
        }
    },

    touchMove(e) {
        if (e.direction == "right") {
            app.terminate();
        }
    },
}
