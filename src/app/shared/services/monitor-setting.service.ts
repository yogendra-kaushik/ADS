import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { MonitorSetting } from 'app/shared';

@Injectable()
export class MonitorSettingService {

  constructor( @Inject(HttpClient) public http: HttpClient) { }

  public rainAlert(monitorSetting: MonitorSetting) {
    let res = this.http.post(Config.serviceUrl + `api/monitor/configuration/rainalert?customerid=${monitorSetting.customerId}
&rainpertip=${monitorSetting.rainpertip}&logintensity=${monitorSetting.logintensity}&logukintensity=${monitorSetting.logukintensity}
&datalogmode=${monitorSetting.datalogmode}&intensityinterval=${monitorSetting.intensityinterval}&alarmenable=${monitorSetting.alarmenable}
&alarmthreshold=${monitorSetting.alarmthreshold}&serialnumber=${monitorSetting.serialnumber}
&ipaddress=${monitorSetting.ipaddress}&locationid=${monitorSetting.locationid}
&samplerate=${monitorSetting.samplerate}&timezone=${monitorSetting.timezone}&usedaylightsavingtime=${monitorSetting.usedaylightsavingtime}
&datadeliveryipaddress=${monitorSetting.datadeliveryipaddress}
&datadeliverynormalrate=${monitorSetting.datadeliverynormalrate}&datadeliveryfastrate=${monitorSetting.datadeliveryfastrate}`, {});
    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  public activateLocation(customerId: number, locationid: number, serialnumber: string, ipaddress: string) {
    return this.http.post(Config.serviceUrl + `api/Monitor/activate?customerId=${customerId}&LocationID=${locationid}
&SerialNumber=${serialnumber}&IPAddress=${ipaddress}`, {})
      .catch(error => {
        console.dir(error.json());
        return error;
      }).retry(3);
  }

  public echoMonitorConfiguration(monitorSetting: MonitorSetting) {
    let res = this.http.post(Config.serviceUrl + `api/Monitor/configuration/echo?customerId=${monitorSetting.customerId}
&FastRate=${monitorSetting.fastrate}&ManholeDepth=${monitorSetting.manholedepth}&PipeHeight=${monitorSetting.pipeHeight}
&PhysicalOffset=${monitorSetting.physicaloffset}&UnidepthToAverage=${monitorSetting.unidepthtoaverage}
&LowLevelEnable=${monitorSetting.lowlevelenable}&LowLevelThreshold=${monitorSetting.lowlevelthreshold}
&FullPipeEnable=${monitorSetting.fullpipeenable}&HighLevelEnable=${monitorSetting.highlevelenable}
&HighLevelThreshold=${monitorSetting.highlevelthreshold}&HighHighEnable=${monitorSetting.highhighenable}
&HighHighThreshold=${monitorSetting.highhighthreshold}&OverflowEnable=${monitorSetting.overflowenable}
&TiltEnable=${monitorSetting.tiltenable}&TiltThreshold=${monitorSetting.tiltthreshold}&BatteryLowEnable=${monitorSetting.batterylowenable}
&BatteryLowThreshold=${monitorSetting.batterylowthreshold}&SerialNumber=${monitorSetting.serialnumber}
&IpAddress=${monitorSetting.ipaddress}&LocationID=${monitorSetting.locationid}&SampleRate=${monitorSetting.samplerate}
&TimeZone=${monitorSetting.timezone}&UseDaylightSavingTime=${monitorSetting.usedaylightsavingtime}
&DataDeliveryIpAddress=${monitorSetting.datadeliveryipaddress}&DataDeliveryNormalRate=${monitorSetting.datadeliverynormalrate}
&DataDeliveryFastRate=${monitorSetting.datadeliveryfastrate}`, {});
    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }
}
