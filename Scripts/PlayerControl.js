var splitter = ":|:";
var allowedTypes = ["cmd"];

var PlayerControl = {
	name: "Player Control",
	version: "1.0",
	desc: "Now you can bind buttons to commands! There is support for Inventory loader also.",
	enabled: true,
	load: function(){
		if(Core.requirePlugin("InventoryLoader")) allowedTypes.push("inv");
	},
	commandHandler: function(event, args){
		var player = event.player;
		switch(args[0]){
			case '#bind':
			if(!args[1] || !args[2] || !args[3]){player.message("&cCommand using: #bind key type value"); return true;}
			var key = args[1];
			var type = args[2];
			var value = args.slice(3).join(" ");
			
			if(key.toUpperCase()=="ENTER") key = "return";
			if(key.toUpperCase()=="BACKSPACE") key = "back";
			if(key.toUpperCase()=="ESC") key = "escape";
		
			var keyCode = Keyboard.getKeyIndex(key.toUpperCase());
			if(keyCode==0) return true;
		
			data = player.getStoreddata();
		
			if(type=="spec"){
				data.put("speckey-" + value, keyCode);
				return;
			}
			if(allowedTypes.indexOf(type) > -1){
				data.put("key-" + keyCode, type + splitter + value);
				player.message("&2Bind added!");
				return true;
			} else {
				player.message("&cKey type not found! Available key types: " + allowedTypes.join(", "));
			}
			break;
			
			case '#unbind':
			if(!args[1]){player.message("&cCommand using: #unbind key"); return true;}
			if(args[1].toUpperCase()=="ENTER") args[1] = "return";
			if(args[1].toUpperCase()=="BACKSPACE") args[1] = "back";
			if(args[1].toUpperCase()=="ESC") args[1] = "escape";
			if(player.getStoreddata().has("key-" + Keyboard.getKeyIndex(args[1].toUpperCase()))){
				player.getStoreddata().remove("key-" + Keyboard.getKeyIndex(args[1].toUpperCase()));
				player.message("&2Unbinded key");
			} else player.message("&cBind not found!");
			break;
			default: return false;
		}
		return true;
	},
	keyPressed: function(event){
		var player = event.player, key = event.key;
		if(!player.getStoreddata().has("key-" + key)) return;
	
		var content = player.getStoreddata().get("key-" + key).split(splitter);
	
		switch(content[0]){
			case "cmd":
			player.getMCEntity().func_184102_h().func_71187_D().func_71556_a(player.getMCEntity().func_174793_f(), content[1]);
			break;
			case "inv":
			if(!Core.requirePlugin("InventoryLoader")){player.getStoreddata().remove("key-" + key); return;}
			InventoryLoader.loadInventory(player, content[1]);
			break;
		}
	}
	
}
Plugins.push(PlayerControl);
Commands.push("#bind", "#unbind");

function defaultKeys(player){
	player.getStoreddata().put("speckey-up", 200);
	player.getStoreddata().put("speckey-down", 208);
	player.getStoreddata().put("speckey-select", 28);
	player.getStoreddata().put("initialized", "done");
}