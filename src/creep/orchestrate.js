const behaviorDeposit  = require('behavior.deposit');
const behaviorHarvest  = require('behavior.harvest');
const behaviorUpgrade  = require('behavior.upgrade');
const behaviorBuild    = require('behavior.build');
const behaviorRepair   = require('behavior.repair');
const behaviorRepel    = require('behavior.repel');
const behaviorLurk     = require('behavior.lurk');
const behaviorWithdraw = require('behavior.withdraw');

const utilTargets     = require('util.targets');

let behaviorMap = {};
behaviorMap['deposit']  = behaviorDeposit;
behaviorMap['harvest']  = behaviorHarvest;
behaviorMap['upgrade']  = behaviorUpgrade;
behaviorMap['build']    = behaviorBuild;
behaviorMap['repair']   = behaviorRepair;
behaviorMap['repel']    = behaviorRepel;
behaviorMap['lurk']     = behaviorLurk;
behaviorMap['withdraw'] = behaviorWithdraw;

module.exports = {
    run:function(creep) {
        if(!creep.memory.behaviors) {
            creep.say('Role?');
        }
        
        //try a behavior and see if it goes
        if(!creep.memory.currentBehavior) {
            for(let index in creep.memory.behaviors) {
                let behavior = creep.memory.behaviors[index];
                utilTargets.clearTargets(creep);
                creep.memory.timeOnCurrentBehavior = 0;
                if(behaviorMap[behavior].run(creep)) {
                    creep.memory.currentBehavior = behavior;
                    creep.say(behavior);
                    break;
                }
            }
        } else if (!behaviorMap[creep.memory.currentBehavior].run(creep)) {
            utilTargets.clearTargets(creep);
            creep.memory.currentBehavior = false;
            creep.memory.timeOnCurrentBehavior = 0;
        } else {
            creep.memory.timeOnCurrentBehavior++;
        }
    }
}