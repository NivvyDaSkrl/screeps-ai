module.exports = {
    bodyTemplates: [
        {cost: 700, template: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK]},
        {cost: 550, template: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK]},
        {cost: 500, template: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK]},
        {cost: 450, template: [MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK]},
        {cost: 300, template: [MOVE, MOVE, CARRY, CARRY, WORK]}
    ],
    role: 'worker',
    behaviors: ['deposit', 'repair', 'build', 'harvest']
};