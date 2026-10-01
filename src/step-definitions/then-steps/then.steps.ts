const {I} = inject()

Then(
    /^example then step$/,
    function() {
        I.say('Then step')
    },
);
