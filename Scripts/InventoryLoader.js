var InventoryLoader = {
	name: "Inventory loader",
	version: "1.0",
	desc: "Plugin to save and load inventory presets",
	enabled: true,
	saveInventory: function(player, invName){
		var inv = player.getMCEntity().field_71071_by;
		var inventory = [];
		for (var i = 0; i < inv.field_70462_a.length; i++) {
			inventory.push(API.getIItemStack(inv.field_70462_a.get(i)).getItemNbt().toJsonString());
		}
		player.getStoreddata().put("inventory-" + invName, JSON.stringify(inventory));
	},
	loadInventory: function(player, invName){
		if(!player.getStoreddata().has("inventory-" + invName)) return;
		var inventory = JSON.parse(player.getStoreddata().get("inventory-" + invName));
		var world = player.getWorld();
		var inv = player.getMCEntity().field_71071_by;
		inv.func_174888_l(); //Clear
		
		for (var i = 0; i < inventory.length; i++) {
			if(inventory[i] && API.stringToNbt(inventory[i]).getString("id")!="minecraft:air")
			inv.field_70462_a.set(i, world.createItemFromNbt(API.stringToNbt(inventory[i])).getMCItemStack());
		}
		
		inv.func_70296_d(); //Mark dirty
		player.getMCEntity().field_71069_bz.func_75142_b(); //Detect and send changes
	},
	removeInventory: function(player, invName){
		if(!player.getStoreddata().has("inventory-" + invName)) return;
		player.getStoreddata().remove("inventory-" + invName);
	},
	commandHandler: function(event, args){
		player = event.player;
		switch(args[0]){
			case '#inventory':
			case '#inv':
			switch(args[1]){
				case 'load':
				if(!args[2]) return true;
				this.loadInventory(player, args[2]);
				player.message("&2Loaded inventory &3" + args[2]);
				break;
				
				case 'remove':
				case 'delete':
				if(!args[2]) return true;
				this.removeInventory(player, args[2]);
				player.message("&2Removed inventory &3" + args[2]);
				break;
				
				case 'save':
				if(!args[2]) return true;
				this.saveInventory(player, args[2]);
				player.message("&2Saved inventory as &3" + args[2]);
				break;
				default: player.message("&cAvailable subcommands: load, save");
			}
			break;
			default: return false;
		}
		return true;
	}
}
Plugins.push(InventoryLoader);
Commands.push("#inventory");