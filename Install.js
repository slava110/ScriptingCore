var InstallPath = new java.io.File(API.getWorldDir().getAbsolutePath() + "\\scripts\\ecmascript\\Core.js");
var ScriptController = Java.type("noppes.npcs.controllers.ScriptController").Instance;

function init(event){
  event.player.message("Процесс установки Scripting Core запущен. Пожалуйста, подождите...");
  org.apache.commons.io.FileUtils.copyURLToFile(new java.net.URL("https://raw.githubusercontent.com/slava110/ScriptingCore/master/Scripts/Test.js"), InstallPath);
  ScriptController.playerScripts.getScripts()[0].scripts = ["Core.js"];
  event.player.message("Вроде готово. Maybe ready");
}
