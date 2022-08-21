import app from '@system.app';
import brightness from '@system.brightness';
import router from '@system.router';
import storage from '@system.storage';
import interconnect from '@system.interconnect';

const BindKey = "bindkey";

export default {
    data: {
    },

    onInit() {
    },

    onShow() {

        brightness.setKeepScreenOn({ keepScreenOn: true });

        storage.get({
            key: BindKey,
            success: (e) => {
                router.replace({
                    uri: "pages/list/index"
                });
            }
        });
    },

    touchMove(e) {
        if (e.direction == "right") {
            app.terminate();
        }
    }
}
