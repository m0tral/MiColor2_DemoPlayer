import app from '@system.app';
import brightness from '@system.brightness';
import router from '@system.router';
import storage from '@system.storage';
import device from '@system.device';
import config from '../../common/config.js';

export default {
    data: {
        sn: "",
    },

    onInit() {
    },

    onShow() {

        device.getInfo({
            success: (options) => {
                this.sn = options.IMEI;
            }
        });

        brightness.setKeepScreenOn({ keepScreenOn: true });
        setTimeout(this.startActivity, 2000);
    },

    startActivity() {

        storage.get({
            key: config.BIND_KEY,
            success: (e) => {
                router.replace({
                    uri: "pages/network/index",
                    params: { src: this.sn }
                });
            },
            fail: (e) => {
                router.replace({
                    uri: "pages/login/index"
                });
            },
        });
    },

    touchMove(e) {
        if (e.direction == "right") {
            app.terminate();
        }
    }
}
