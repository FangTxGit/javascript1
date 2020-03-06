var Counter = (function () {

    var privateCounter = 0

    function changeBy (num) {
        privateCounter += num
    }
    return {
        add () {
            changeBy(1)
        },
        sub () {
            changeBy(-1)
        },
        value () {
            return privateCounter
        }
    }
})()