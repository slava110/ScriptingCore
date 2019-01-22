var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
var Keyboard = Java.type("org.lwjgl.input.Keyboard");
var File = Java.type("java.io.File");
var ScriptsPath = API.getWorldDir().getAbsolutePath() + "\\scripts\\ecmascript\\";
var ScriptsFolder = new File(ScriptsPath);
var ConfigPath = API.getWorldDir().getAbsolutePath() + "\\scripts\\config\\";
var ConfigFolder = new File(ConfigPath);
var env = this;

var NBTTagCompound = Java.type("net.minecraft.nbt.NBTTagCompound");

var InventoryBasic = Java.type("net.minecraft.inventory.InventoryBasic");

var JFU = Java.type("org.apache.commons.io.FileUtils");
var URL = Java.type("java.net.URL");

var ScriptController = Java.type("noppes.npcs.controllers.ScriptController").Instance;
//ScriptController.playerScripts.getScripts()[0].scripts = ["tester.js"];
//ScriptController.playerScripts.getScripts()[0].run("toRun", EVENT);
//
//

var Files = Java.type("java.nio.file.Files");
var Paths = Java.type("java.nio.file.Paths");
var Charset = Java.type("java.nio.charset.StandardCharsets").UTF_8;

var ScriptedItems = [];

var Plugins = [];
var Commands = ["#plugins", "#help", "#install", "#uninstall"];

var Core = {
	loadData: function(id){
		if(this.hasData(id)) return JSON.parse(API.getIWorld(0).getStoreddata().get(id));
		return;
	},
	hasData: function(id){
		return API.getIWorld(0).getStoreddata().has(id);
	},
	saveData: function(id, data){
		API.getIWorld(0).getStoreddata().put(id, JSON.stringify(data));
	},
	requirePlugin: function(name){
		return typeof env[name] !== "undefined"
	},
	requireMod: function(modid){
		return Java.type("net.minecraftforge.fml.common.Loader").isModLoaded(modid);
	},
	showGui: function(player, name, itemlist){
		var inv = new InventoryBasic(name, true, Math.ceil(itemlist.length/9));
		for (var i = 0; i < itemlist.length; i++)
			inv.func_174894_a(itemlist[i].getMCItemStack());
	
		player.getMCEntity().func_71007_a(inv);
	},
	getScriptedItem: function(id, name, texture, script){
		var inbt = API.stringToNbt('{ForgeCaps:{"customnpcs:itemscripteddata":{ScriptEnabled:1b,DurabilityValue:1.0d,Scripts:[{Script:"",Console:[],ScriptList:[{Line:"items/'+script+'.js"}]}],ItemColor:-1,DurabilityShow:0b,ScriptLanguage:"ECMAScript",DurabilityColor:-1}},id:"customnpcs:scripted_item",Count:1,Damage:0,tag:{ScriptedData:{ScriptEnabled:1b,Scripts:[{Script:"",Console:[],ScriptList:[{Line:"items/'+ script.toLowerCase() +'.js"}]}],ScriptLanguage:"ECMAScript"},display:{Name:"\u00a7r'+name+'"}},Damage:'+id+'s}}');
		item = API.getIWorld(0).createItemFromNbt(inbt);
		item.setTexture(id, texture);
		return item;
	}
}

//function showItemsList(player, page){
//	var inv = new InventoryBasic("\u00a72Items", true, 18);
//	for (var i = 0; i < ScriptedItems.length; i++)
//		inv.func_174894_a(ScriptedItems[i]);
//	
//	player.getMCEntity().func_71007_a(inv);
//}


function chat(event){
	var message = event.message, player = event.player;
	if(message[0]=='#'){
		event.setCanceled(true);
		var args = message.split(' ');
		//-------COMMANDS-------
		switch(args[0]){
			case '#plugin':
			case '#pl':
			switch(args[1]){
				case 'reload':
				init(event);
				return;
				break;
				
				case 'list':
				//Плагины
				player.message("&7===&6\u041f\u043b\u0430\u0433\u0438\u043d\u044b&7===");
				for(var i = 0; i < Plugins.length; i++)
					if(Plugins[i].enabled)
						player.message("&7-&2 " + Plugins[i].name);
					else
						player.message("&7-&c " + Plugins[i].name);
				return;
				break;
				
				case 'info':
				if(!args[2] || !Core.requirePlugin(args[2])) {player.message("&cPlugin not found!"); return};
				splugin = env[args[2]];
 				player.message("&7===&6"+splugin.name+"&7===");
				if(splugin.version)
					//Версия: %s
					player.message("&7\u0412\u0435\u0440\u0441\u0438\u044f: &6" + splugin.version);
				if(splugin.desc)
					//Описание: %s
					player.message("&7\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435: &6" + splugin.desc);
				return;
				break;
				//Доступные подкоманды
				default: player.message("&c\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u043f\u043e\u0434\u043a\u043e\u043c\u0430\u043d\u0434\u044b: reload, list, info"); return true;
			}
			break;
			
			case '#help':
			//Доступные команды
			player.message("&7\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b: &6" + Commands.join("&7, &6") + "&7.");
			return;
			break;
			
			case '#install':
			if(!args[1]) return;
			try{
			Utils.downloadFile("https://raw.githubusercontent.com/slava110/ScriptingCore/master/Scripts/"+args[1]+".js", new File(ScriptsPath + args[1] + ".js"));
			ScriptController.playerScripts.getScripts()[0].scripts.add(args[1].toLowerCase() + ".js");
			//Скрипт %s успешно установлен
			player.message("&2\u0421\u043a\u0440\u0438\u043f\u0442 &3" + args[1] + "&2 \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d");
			ScriptController.setPlayerScripts(ScriptController.playerScripts.writeToNBT(new NBTTagCompound()));
			ScriptController.loadCategories();
			ScriptController.loadPlayerScripts();
			} catch(e){
				//Во время установки скрипта произошла ошибка
				player.message("&c\u0412\u043e \u0432\u0440\u0435\u043c\u044f \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u0430 \u043f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430");
			}
			return;
			
			break;
			
			case '#uninstall':
			if(!args[1]) return;
			try{
			file = new File(ScriptsPath + args[1] + ".js");
			file.delete();
			ScriptController.playerScripts.getScripts()[0].scripts.remove(args[1].toLowerCase() + ".js");
			//Скрипт %s успешно деинсталлирован
			player.message("&2\u0421\u043a\u0440\u0438\u043f\u0442 &3" + args[1] + "&2 \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u0434\u0435\u0438\u043d\u0441\u0442\u0430\u043b\u043b\u0438\u0440\u043e\u0432\u0430\u043d");
			ScriptController.setPlayerScripts(ScriptController.playerScripts.writeToNBT(new NBTTagCompound()));
			ScriptController.loadCategories();
			ScriptController.loadPlayerScripts();
			} catch(e){
				//Во время деинсталляции скрипта произошла ошибка
				player.message("&c\u0412\u043e \u0432\u0440\u0435\u043c\u044f \u0434\u0435\u0438\u043d\u0441\u0442\u0430\u043b\u043b\u044f\u0446\u0438\u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u0430 \u043f\u0440\u043e\u0438\u0437\u043e\u0448\u043b\u0430 \u043e\u0448\u0438\u0431\u043a\u0430");
			}
			return;
			
			break;
			
			//Plugin commands
			default:
			for(var i = 0; i < Plugins.length; i++){
				if(Plugins[i]["commandHandler"] && Plugins[i].enabled && Plugins[i].commandHandler(event, args)) return;
			}
		}
		//Команда не найдена
		player.message("&c\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430!");
	}
		
}
//----------------Init----------------
function init(event){
	data = API.getIWorld(0).getTempdata();
	//if(!data.has("loaded")){
	//	
	//	data.put("loaded", "yup");
	//}
	for (var i = 0; i < Plugins.length; i++){
		if(Plugins[i]["load"]) Plugins[i].load();
	}
}
//------------------------------------
function keyPressed(event){
	for (var i = 0; i < Plugins.length; i++){
		if(Plugins[i]["keyPressed"] && Plugins[i].enabled) Plugins[i].keyPressed(event);
	}
}


var Utils = {
	readFile: function(stringPath){
		path = Paths.get(stringPath);
		try{
			lines = Files.readAllLines(path, Charset);
			return lines;
		} catch (e){
			return null;
		}
	},
	
	//Example: downloadFile("https://pastebin.com/raw/_____", "D:/TesterGround/test.txt")
	downloadFile: function(address, dest){
		JFU.copyURLToFile(new URL(address), new File(dest));
	},
	
	randomNum: function(min, max) {
		var rand = min - 0.5 + Math.random() * (max - min + 1)
		rand = Math.round(rand);
		return rand;
	},
	
	codeToColor: function(code){
		if(code.indexOf("&0")>=0) return "000000"; if(code.indexOf("&8")>=0) return "555555";
		if(code.indexOf("&1")>=0) return "0000AA"; if(code.indexOf("&9")>=0) return "5555FF";
		if(code.indexOf("&2")>=0) return "00AA00"; if(code.indexOf("&a")>=0) return "55FF55";
		if(code.indexOf("&3")>=0) return "00AAAA"; if(code.indexOf("&b")>=0) return "55FFFF";
		if(code.indexOf("&4")>=0) return "AA0000"; if(code.indexOf("&c")>=0) return "FF5555";
		if(code.indexOf("&5")>=0) return "AA00AA"; if(code.indexOf("&d")>=0) return "FF55FF";
		if(code.indexOf("&6")>=0) return "FFAA00"; if(code.indexOf("&e")>=0) return "FFFF55";
		if(code.indexOf("&7")>=0) return "AAAAAA"; if(code.indexOf("&f")>=0) return "FFFFFF";
		return "";
	},
	lookBlock: function(player){
		return player.rayTraceBlock(4.0, true, false).getBlock();
	},
	lookEntity: function(player){
		entities = player.rayTraceEntities(4.0, true, false);
		if(entities) return player.rayTraceEntities(4.0, true, false)[0];
		return;
	},
	clickableMessage: function(player, message, command){
		API.createNPC(player.getWorld().getMCWorld()).executeCommand('/tellraw '+player.getName()+' ["",{"text":"' + message + '","clickEvent":{"action":"run_command","value":"' + command + '"}}]');
	},
	alert: function(message){
		API.getIWorld(0).broadcast(message);
	}
}