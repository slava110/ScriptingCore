var TestingScript = {
	name: "Testing script",
	version: "1.0",
	desc: "Just for test",
	enabled: true,
  load: function(){
    API.getIWorld(0).broadcast("Yay, I'm loaded!");
  }
}
Plugins.push(TestingScript);
