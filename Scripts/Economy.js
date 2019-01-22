var CurrencyList = {Cr:{name:"Credits", rate:1}};

var Economy = {
	name: "Economy",
	version: "1.0 pre",
	desc: "Adding currency system to the game",
	enabled: true,
	saveData: function(){
		Core.saveData("currencies", CurrencyList);
	},
	load: function(){
		//CurrencyList = Core.loadData("currencies");
		//API.getIWorld(0).broadcast("Loaded Economy");
	},
	getCurrency: function(cap){
		return CurrencyList[cap];
	},
	removeCurrency: function(cap){
		delete CurrencyList[cap];
	},
	commandHandler: function(event, args){
		player = event.player;
		switch(args[0]){
			case '#currency':
			case '#cur':
			switch(args[1]){
				case 'add':
				if((!args[2] || !args[3] || !args[4]) || CurrencyList[args[2]]) return true;
				new Currency(args[2], args[3], args[4]);
				this.saveData();
				player.message("&2Currency " + args[3] + " succefully added");
				break;
			
				case 'remove':
				if(!args[2]) return true;
				this.removeCurrency(args[2]);
				this.saveData();
				break;
			
				case 'setrate':
				if(!args[2] || !args[3]) return true;
				this.getCurrency(args[2]).rate = parseInt(args[3]);
				this.saveData();
				break;
			
				case 'list':
				player.message("<---Currency list--->");
				for (currencyName in CurrencyList) {
					if(currencyName == "Cr") continue;
					currency = CurrencyList[currencyName];
					player.message("\u00a72>\u00a7r" + currency.name + " ["+ currencyName +"]\u00a7f | \u00a72Rate: \u00a761 Cr = " + (1/currency.rate).toFixed(2) + " " + currencyName);
				}
			break;
			default: player.message("&cAvailable subcommands: add, remove, setrate, list");
		}
		break;
		default: return false;
		}
		return true;
	}
}
Plugins.push(Economy);
Commands.push("#currency");

function Currency(cap, name, rate){
	this.name = name;
	this.rate = rate;
	CurrencyList[cap] = this;
}