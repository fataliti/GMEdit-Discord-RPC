(function() {
    GMEdit.register("discord-status", {
        init: function(PluginState) {
            const DiscordRPC = require(PluginState.dir+"\\node_modules\\discord-rpc");
            const clientId = '831957674563993631';
            const rpc = new DiscordRPC.Client({ transport: 'ipc' });
            
            rpc.once('ready', () => {
                setActivity();
            });

            
            
            const keys = [
                ['GameMaker Project','GameMaker: Studio Project','GameMaker: Studio 2 Project'],
                ['gm8','gms1','gms2'],
            ];

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
                let ver = $gmedit["gml.Project"].current.version.config.projectModeId;
                if (ver != 2 && ver != 1) {
                    ver = 0;
                }
                activity.smallImageKey = keys[1][ver],
                activity.smallImageText = keys[0][ver],
                rpc.setActivity(activity);
            });

            GMEdit.on("projectClose", function(e) {
                activity.details = 'GMEdit';
                activity.state = 'WelcomePage';
                activity.startTimestamp = null;
                activity.smallImageKey = 'null';
                activity.smallImageText = 'null';
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