import app from '@system.app';
import brightness from '@system.brightness';
import router from '@system.router';
import storage from '@system.storage';
import network from '@system.network';

const BindKey = "bindkey";

export default {
    data: {
        isWifiAvailable: false,
        err_no_wifi: false,
    },

    onInit() {
    },

    onShow() {
        brightness.setKeepScreenOn({ keepScreenOn: true });

        network.subscribe({
            type: "WIFI",
            callback: (e) => {
                this.isWifiAvailable = e;

                if (this.isWifiAvailable) {
                    network.unsubscribe({type: "WIFI"});

                    this.handleLogin();
                }

                this.err_no_wifi = true;
            },
        });
    },

    handleLogin() {
    },
}
