module.exports = {
    bodyTemplates: [
        {cost: 650, template: [MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK]},
        {cost: 550, template: [MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK]},
        {cost: 400, template: [MOVE, MOVE, CARRY, CARRY, WORK, WORK]},
        {cost: 300, template: [MOVE, MOVE, CARRY, CARRY, WORK]}
    ],
    role: 'upgrader',
    behaviors: ['upgrade', 'withdraw', 'harvest']
};