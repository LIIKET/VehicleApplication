FLAGS:

--replay "{filename}"
--record "{filename}"
--noazure
--notemp
--nogps
--nolight

CONFIGURE:
Uses file config.json in same directory as application. Format like so:

{
  "PortName": "{PortName}",
  "HostName": "{IoTHuBAdress}",
  "DeviceId": "{DeviceId}",
  "AccessKey": "{DeviceKey}"
}