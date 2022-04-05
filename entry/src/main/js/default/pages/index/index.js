import app from '@system.app';
import brightness from '@system.brightness';
import router from '@system.router';

export default {
    data: {
        hour: '00',
        min: '00',
        sec: '00',

        intervalId: -1
    },

    onInit() {
        this.setTime();
    },

    onShow() {
        brightness.setKeepScreenOn({ keepScreenOn: true });

        this.refreshTime();
    },

    touchMove(e) {
        if (e.direction == "right") {

            if (this.intervalId != -1)
                clearInterval(this.intervalId);

            app.terminate();
        }
        else if (e.direction == "left") {
            router.replace({
                uri: "pages/list/index"
            });
        }
    },

    refreshTime() {

        this.intervalId = setInterval(() => {
            this.setTime();
        }, 1000);
    },

    setTime() {
        var time = new Date();
        var h = time.getHours();
        this.hour = h < 10 ? "0"+h : h;
        var m = time.getMinutes();
        this.min = m < 10 ? "0"+m : m;
        var s = time.getSeconds();
        this.sec = s < 10 ? "0"+s : s;
    }
}
