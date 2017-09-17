import { EventEmitter, Injectable } from '@angular/core';

import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class Config {
    public static serviceUrl = environment.serviceUrl;
    public static apiUrl = environment.apiUrl;

    static formats = {
        date: 'DD MMM, YYYY'
    };


    static getUrl(url: string): string {
        return (url.endsWith('.json') ? Config.apiUrl : Config.serviceUrl) + url;
    }

    // tslint:disable-next-line:member-ordering
    static urls = {
        hydrograph: Config.getUrl('data/hydrograph-sample.json'),
        mapviews: Config.getUrl('data/map-views.json'),
        maptypes: Config.getUrl('data/map-types.json'),
        markerLocationDetails: Config.getUrl('data/locations/details/'),
        customers: {
            get: Config.getUrl('data/customers.json'),
            pipeElements: Config.getUrl('data/pipe-elements.json'),
            flowDataGraphics: Config.getUrl('data/flow-data-graphics.json'),
            isoQLines: Config.getUrl('data/iso-q-lines.json'),
            dayStatusAnalysis: Config.getUrl('data/day-status-analysis.json'),
            analysisBatch: Config.getUrl('data/analysis-batch.json'),
            dayStausReviewers: Config.getUrl('data/day-status-reviewers.json'),
        },
        timeZone: Config.getUrl('data/time-zone.json'),
        dataSummaryReportOverview: Config.getUrl('api/reports/DailySummary/'),
        dataSummaryReportDetails: Config.getUrl('api/reports/DailySummary/details'),
        permission: Config.getUrl('data/permission.json'),
        crowdcoreTopScore: Config.getUrl('api/Judgements/top5'),
        crowdcoreJudgements: Config.getUrl('api/Judgements'),
        submissionsCount: Config.getUrl('api/Judgements/submissions/count'),
        crowdcoreStatus: Config.getUrl('api/Judgements/status'),
        qstartBaseUrl: Config.getUrl('api/monitor/'),
        batteryStatusUrl: Config.getUrl('data/Locations/customers/'),
        locationDetails: Config.getUrl('data/Locations/details/'),
        locationGroup: {
            prefixUrl: 'api/customers/',
            getUrl: 'api/locationgroups',
            postUrl: 'api/locationgroups',
            deleteUrl: 'api/locationgroups/',
        },
        vaultStructure: Config.getUrl('api/vault'),
        vaultDownlodFile: Config.getUrl('api/vault/file'),
        vaultDeleteFile: Config.getUrl('api/vault/file'),
        vaultLinkShare: Config.getUrl('api/vault/urlAuthorization'),
        vaultUpload: Config.getUrl('api/vault/upload')
    };
}
