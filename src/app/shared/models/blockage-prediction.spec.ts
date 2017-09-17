
import { TestBed, async } from '@angular/core/testing';
import { BlockagePrediction } from './blockage-prediction';

describe('BlockagePrediction', () => {
    it('create an instance', () => {
        let blockagePrediction = new BlockagePrediction();
        expect(blockagePrediction).toBeDefined();
    });

    it('should return the correct properties', () => {
        let blockagePrediction = new BlockagePrediction();
        blockagePrediction.locationId = 34;
        blockagePrediction.locationName = 'MF01';
        blockagePrediction.bpScore = 11;
        blockagePrediction.bpFlag = true;
        //blockagePrediction.date = new Date('2017-03-09T00:00:00');
        blockagePrediction.depthTrend = [11, 22];
        blockagePrediction.bpFlagTrend = [1, -1, 1];
        blockagePrediction.status = 'Green';

        expect(blockagePrediction.locationId).toBe(34);
        expect(blockagePrediction.locationName).toBe('MF01');
        expect(blockagePrediction.bpScore).toBe(11);
        expect(blockagePrediction.bpFlag).toBe(true);
        //expect(blockagePrediction.date).toBe('2017-03-09T00:00:00');
        expect(blockagePrediction.depthTrend.length).toBe(2);
        expect(blockagePrediction.bpFlagTrend.length).toBe(3);
        expect(blockagePrediction.status).toBe('Green');
    });
});
