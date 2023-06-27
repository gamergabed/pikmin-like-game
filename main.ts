namespace SpriteKind {
    export const Gui = SpriteKind.create()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    scene.cameraShake(2, 700)
    music.play(music.tonePlayable(831, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
    for (let value of sprites.allOfKind(SpriteKind.Projectile)) {
        if (VisonArea2(Indicater, value, 40)) {
            value.follow(mySprite, sprites.readDataNumber(value, "speed"))
            sprites.setDataBoolean(value, "following?", true)
        } else {
            value.follow(mySprite, 0)
            sprites.setDataBoolean(value, "following?", false)
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (en.value > 9) {
        en.value += -10
        for (let value of sprites.allOfKind(SpriteKind.Projectile)) {
            if (sprites.readDataBoolean(value, "following?")) {
                timer.background(function () {
                    for (let index = 0; index < 20; index++) {
                        value.z += 0.1
                        value.scale += 0.1
                        pause(25)
                    }
                    for (let index = 0; index < 20; index++) {
                        value.z += -0.1
                        value.scale += -0.1
                        pause(25)
                    }
                    value.scale = 1
                })
                timer.background(function () {
                    sprites.setDataBoolean(value, "following?", false)
                    value.follow(mySprite, 0)
                    value.setVelocity(Indicater.x - value.x, Indicater.y - value.y)
                    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
                    pause(1050)
                    value.setVelocity(0, 0)
                    for (let myEnemy of sprites.allOfKind(SpriteKind.Enemy)) {
                        if (value.overlapsWith(myEnemy)) {
                            sprites.changeDataNumberBy(myEnemy, "hp", -1)
                            if (sprites.readDataNumber(myEnemy, "hp") <= 0) {
                                sprites.destroy(myEnemy)
                                info.changeScoreBy(1)
                            }
                        }
                    }
                })
                break;
            }
        }
    }
})
function makeUndergroundPikmin () {
    pikmin = sprites.create(assets.image`undergroundPikmin`, SpriteKind.Food)
    pikmin.setPosition(randint(10, 150), randint(10, 110))
}
function makePikmin (X: number, Y: number) {
    pikmin = sprites.create([
    assets.image`redPikmin`,
    assets.image`bluePikmin`,
    assets.image`greenPikmin`,
    assets.image`yellowPikmin`,
    assets.image`brownPikmin`,
    assets.image`purplePikmin`,
    assets.image`lightbluePikmin`,
    assets.image`whitePikmin`
    ]._pickRandom(), SpriteKind.Projectile)
    sprites.setDataBoolean(pikmin, "following?", false)
    sprites.setDataNumber(pikmin, "speed", randint(15.0000001, 40.9999999))
    pikmin.setPosition(X, Y)
}
function VisonArea2 (S1: Sprite, S2: Sprite, Range: number) {
    return Math.sqrt(Math.abs((S1.x - S2.x) ** 2 - (S1.y - S2.y) ** 2)) < Range
}
statusbars.onZero(StatusBarKind.Health, function (status) {
    game.gameOver(false)
})
function VisonArea (S1: Sprite, S2: Sprite, Range: number) {
    return Math.sqrt(Math.abs((S1.x - S2.x) ** 2 - (S1.y - S2.y) ** 2)) > Range
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    makePikmin(otherSprite.x, otherSprite.y)
    sprites.destroy(otherSprite)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.follow(sprite, 2)
    HealthBar.value += -1
    pause(100)
})
let mySprite2: Sprite = null
let pikmin: Sprite = null
let Indicater: Sprite = null
let mySprite: Sprite = null
let en: StatusBarSprite = null
let HealthBar: StatusBarSprite = null
HealthBar = statusbars.create(50, 8, StatusBarKind.Health)
en = statusbars.create(50, 2, StatusBarKind.Energy)
en.max = 100
HealthBar.setPosition(80, 4)
en.setPosition(80, 8)
for (let index = 0; index < 10; index++) {
    makePikmin(randint(10, 150), randint(10, 110))
}
mySprite = sprites.create(assets.image`Player`, SpriteKind.Player)
Indicater = sprites.create(assets.image`Indicator`, SpriteKind.Gui)
animation.runImageAnimation(
Indicater,
assets.animation`indicatorAnim`,
50,
true
)
mySprite.setStayInScreen(true)
Indicater.setStayInScreen(true)
controller.moveSprite(Indicater)
game.onUpdate(function () {
    if (VisonArea(mySprite, Indicater, 10)) {
        mySprite.follow(Indicater, 70)
    } else {
        mySprite.follow(Indicater, 0)
    }
    for (let myEnemy of sprites.allOfKind(SpriteKind.Enemy)) {
        if (sprites.readDataBoolean(myEnemy, "p?")) {
            myEnemy.follow(sprites.readDataSprite(myEnemy, "pikmin"), 10)
            if (myEnemy.overlapsWith(sprites.readDataSprite(myEnemy, "pikmin"))) {
                sprites.destroy(sprites.readDataSprite(myEnemy, "pikmin"))
                music.play(music.stringPlayable("A A G F E D C C ", 400), music.PlaybackMode.InBackground)
                sprites.setDataBoolean(myEnemy, "p?", Math.percentChance(50))
                sprites.setDataSprite(myEnemy, "pikmin", sprites.allOfKind(SpriteKind.Projectile)._pickRandom())
            }
        } else {
            myEnemy.follow(mySprite, 10)
        }
    }
})
game.onUpdateInterval(5000, function () {
    mySprite2 = sprites.create(assets.image`enemy`, SpriteKind.Enemy)
    sprites.setDataBoolean(mySprite2, "p?", Math.percentChance(35))
    sprites.setDataSprite(mySprite2, "pikmin", sprites.allOfKind(SpriteKind.Projectile)._pickRandom())
    sprites.setDataNumber(mySprite2, "hp", 2)
    mySprite2.setPosition(randint(10, 150), randint(10, 110))
})
game.onUpdateInterval(2000, function () {
    if (sprites.allOfKind(SpriteKind.Projectile).length - 1 < 35) {
        makeUndergroundPikmin()
    }
})
game.onUpdateInterval(60000, function () {
    HealthBar.value += 10
})
game.onUpdateInterval(500, function () {
    en.value += 5
})
