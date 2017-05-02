var fs = require('fs');
var OBDReader = require('bluetooth-obd');
var btOBDReader = new OBDReader();
var dataReceivedMarker = {};

var filedata = [];
var messagesread = 0;
var messagesrequested = 500;

btOBDReader.on('connected', function () {
//  this.requestValueByName("vss"); //vss = vehicle speed sensor
//	console.log(this.requestValueByName);

this.addPoller("temp");
this.addPoller("fuelsys");
this.addPoller("load_pct");

this.addPoller("frp");
this.addPoller("map");
this.addPoller("rpm");
this.addPoller("vss");
this.addPoller("iat");
this.addPoller("throttlepos");
this.addPoller("runtm");
this.addPoller("engineoilt");
this.addPoller("aet");
this.addPoller("fpc");



   // this.addPoller("pidsupp0");
/*    this.addPoller("dtc_cnt");
    this.addPoller("dtcfrzf");
    this.addPoller("fuelsys");
    this.addPoller("load_pct");
    this.addPoller("temp");
    this.addPoller("shrtft13");
    this.addPoller("longft13");
    this.addPoller("shrtft24");
    this.addPoller("longft24");
    this.addPoller("frp");
    this.addPoller("map");
    this.addPoller("rpm");
    this.addPoller("vss");
    this.addPoller("sparkadv");
this.addPoller("iat");

    this.addPoller("maf");
    this.addPoller("throttlepos");
    this.addPoller("air_stat");
    this.addPoller("o2sloc");
    this.addPoller("o2s11");
    this.addPoller("o2s12");
    this.addPoller("o2s13");
    this.addPoller("o2s14");

    this.addPoller("o2s21");
    this.addPoller("o2s22");
    this.addPoller("o2s23");
    this.addPoller("o2s24");
    this.addPoller("obdsup");
    this.addPoller("o2sloc2");
    this.addPoller("pto_stat");
    this.addPoller("runtm");
    this.addPoller("piddsupp2");
  this.addPoller("");
this.addPoller("mil_dist");

this.addPoller("frpm");
this.addPoller("frpd");
this.addPoller("lambda11");
this.addPoller("lambda12");
this.addPoller("lambda13");
this.addPoller("lambda14");
this.addPoller("lambda21");
this.addPoller("lambda22");
this.addPoller("lambda23");
this.addPoller("lambda24");
this.addPoller("egr_pct");
this.addPoller("egr_err");
this.addPoller("evap_pct");
this.addPoller("fli");
this.addPoller("warm_ups");
this.addPoller("clr_dist");
this.addPoller("evap_vp");
this.addPoller("baro");

this.addPoller("lambdac11");
this.addPoller("lambdac12");
this.addPoller("lambdac13");
this.addPoller("lambdac14");
this.addPoller("lambdac21");
this.addPoller("lambdac22");
this.addPoller("lambdac23");
this.addPoller("lambdac24");
this.addPoller("catemp11");
this.addPoller("catemp21");
this.addPoller("catemp12");
this.addPoller("catemp22");
this.addPoller("piddsupp4");
this.addPoller("monitorstat");
this.addPoller("vpwr");
this.addPoller("load_abs");
this.addPoller("lambda");
this.addPoller("tp_r");
this.addPoller("aat");
this.addPoller("tp_b");
this.addPoller("tp_c");
this.addPoller("app_d");
this.addPoller("app_e");
this.addPoller("app_f");
this.addPoller("tac_pct");
this.addPoller("mil_time");

this.addPoller("clr_time");
this.addPoller("exttest1");
this.addPoller("exttest2");
this.addPoller("fuel_type");
this.addPoller("alch_pct");
this.addPoller("system_vp");
this.addPoller("abs_vp");
this.addPoller("s02b13");
this.addPoller("l02b13");
this.addPoller("s02b24");
this.addPoller("l02b24");
this.addPoller("frp_abs");
this.addPoller("pedalpos");
this.addPoller("hybridlife");
this.addPoller("engineoilt");
this.addPoller("finjtiming");
this.addPoller("enginefrate");
this.addPoller("emmissionreq");
this.addPoller("aet");
this.addPoller("ect");
this.addPoller("egrt");
this.addPoller("fpc");
this.addPoller("ipct");
this.addPoller("ep");
this.addPoller("egt");
this.addPoller("requestdtc");
this.addPoller("cleardtc");
this.addPoller("vinsupp0");
this.addPoller("vin_mscout");
this.addPoller("vin");*/





    this.startPolling(1000); //Request all values each second.
});

btOBDReader.on('dataReceived', function (data) {
    //Object.keys(obj).length === 0 && obj.constructor === Object
    if(!(Object.keys(data).length === 0 && data.constructor === Object) && !(data.value == "NO DATA")){
        console.log(data);
        dataReceivedMarker = data;

        console.log("dataReceivedMarker");
    /*
        dataReceivedMarker.forEach(function(item){
            console.log("item: " + item);
        });
    */
        console.log(messagesread);

        var recordFile = "replay.json";
    
        //obj = JSON.parse(filedata); //now it an object
        filedata.push(data); //add some data

        messagesread++;

        if(messagesread >= messagesrequested){
            this.removeAllPollers();
            

        json = JSON.stringify(filedata); //convert it back to json
        fs.writeFile(recordFile, json, 'utf8', function(){}); // write it back 
        }

      }

});

// Use first device with 'obd' in the name
btOBDReader.autoconnect('OBD');
