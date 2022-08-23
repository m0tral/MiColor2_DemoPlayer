import app from '@system.app';
import brightness from '@system.brightness';
import router from '@system.router';
import network from '@system.network';
import device from '@system.device';
import fetch from '@system.fetch';

const USER_AGENT = "$string:user_agent";
const URL_LOGIN = "https://miwatch.corout.in/app.player/login.php?id=";
const URL_STATUS = "http://miwatch.corout.in/app.player/status.php?id=";

export default {
    data: {
        isWifiAvailable: false,
        err_no_wifi: false,
        show_qrcode: false,
        show_sync: false,
        sn: "",
        qr_value: URL_LOGIN,
        status: "INIT",
    },

    onInit() {
        device.getInfo({
            success: (options) => {
                this.sn = options.IMEI;
                this.qr_value = URL_LOGIN + this.sn;
            }
        });
    },

    onShow() {
        brightness.setKeepScreenOn({ keepScreenOn: true });

        network.subscribe({
            type: "WIFI",
            callback: (e) => {
                this.isWifiAvailable = e;

                if (this.isWifiAvailable) {
                    this.handleLogin();
                }
                else {
                    this.status = "INIT";
                    this.handleError();
                }
            },
        });
    },

    onHide() {
        network.unsubscribe({type: "WIFI"});
    },


    handleError() {
        this.err_no_wifi = true;
        this.show_qrcode = false;
        this.show_sync = false;
    },

    handleLogin() {
        this.err_no_wifi = false;
        this.show_qrcode = true;

        this.runWaiting();
    },

    handleSync() {
        this.err_no_wifi = false;
        this.show_qrcode = false;
        this.show_sync = true;

        //router.replace({
        //    uri: "pages/playlist/index"
        //});

        router.replace({
            uri: "pages/network/index",
            params: { src: this.sn }
        });
    },

    runWaiting() {
        if (this.isWifiAvailable) {
            setTimeout(() => { this.awaitingDone(); }, 1000);
        }
    },

    awaitingDone() {

        if (this.isWifiAvailable) {

            if (this.status == "READY")
                return;

            fetch.fetch({
                url: URL_STATUS + this.sn,
                method: "GET",
                header: {
                    "User-Agent": USER_AGENT
                },
                success: (e) => {
                    this.status = e.data.status;
                    if (this.status == "READY")
                        this.handleSync();
                },
                complete: (e) => {
                    this.runWaiting();
                }
            });
        }
    },

    touchMove(e) {
        if (e.direction == "right") {
            app.terminate();
        }
    }
}
