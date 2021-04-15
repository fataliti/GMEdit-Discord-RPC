(function() {
    GMEdit.register("discord-status", {
        init: function(PluginState) {
            const DiscordRPC = require(PluginState.dir+"\\node_modules\\discord-rpc");
            const clientId = '831957674563993631';
            const rpc = new DiscordRPC.Client({ transport: 'ipc' });
            
            rpc.once('ready', () => {
                setActivity();
            });

            var activity = {
                details: "GMEdit",
                state: "WelcomePage",
                instance: false,
                largeImageKey: 'icon512'
            }
            async function setActivity() {
                if (!rpc) return;
                rpc.setActivity(activity);
            }
            rpc.login({ clientId }).catch(console.error);

            GMEdit.on("projectOpen", function(e) {
                activity.details = 'project: ' + e.project.displayName;
                activity.startTimestamp = Date.now();
                rpc.setActivity(activity);
            });
            GMEdit.on("projectClose", function(e) {
                activity.details = 'GMEdit';
                activity.state = 'WelcomePage';
                activity.startTimestamp = null,
                rpc.setActivity(activity);
            });
            GMEdit.on("fileOpen", function(e) {
                activity.state = e.file.name;
                rpc.setActivity(activity);
            });
            GMEdit.on("activeFileChange", function(e) {
                activity.state =  e.file.name;
                if (e.file.name != "WelcomePage") {
                    activity.state = "file: "+ activity.state;
                }
                rpc.setActivity(activity);
            });
        }
    });
})();