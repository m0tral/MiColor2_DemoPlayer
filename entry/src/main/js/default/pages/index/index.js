import app from '@system.app';
import brightness from '@system.brightness';
import router from '@system.router';
import storage from '@system.storage';

const BindKey = "bindkey";

export default {
    data: {
    },

    onInit() {
    },

    onShow() {

        brightness.setKeepScreenOn({ keepScreenOn: true });
        setTimeout(this.startActivity, 2000);

        storage.delete({ key: BindKey});
    },

    startActivity() {

        storage.get({
            key: BindKey,
            success: (e) => {
                router.replace({
                    uri: "pages/list/index"
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
