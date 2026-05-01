class Demo1 extends AdventureScene {
    constructor() {
        super("demo1", "First Room");
    }
    preload() {
        this.load.setBaseURL('https://katm6211.github.io/d2project/');
        this.load.image('bg', 'Assets/Sprite/Background_plain2.png');
        this.load.spritesheet('sprite', 'Assets/Sprite/totalsprite.png', { frameWidth: 16, frameHeight: 32 });
    }



    onEnter() {
        const { width, height } = this.scale;
        const bg = this.add.image(width * 3 / 4 / 2, height / 2, 'bg').setScale(4);
        const sprite = this.sprite = this.physics.add.sprite(100, 450, 'sprite').setScale(4);

        this.input.on('pointerup', (pointer) => {
            sprite.body.reset(sprite.x, sprite.y);
            sprite.anims.stop();
        });
        
        this.input.on('pointerdown', (pointer) => {


            this.physics.moveToObject(sprite, pointer, 200);
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'front',
                frames: this.anims.generateFrameNumbers('sprite', { start: 6, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('sprite', { start: 3, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'back',
                frames: this.anims.generateFrameNumbers('sprite', { start: 9, end: 11 }),
                frameRate: 10,
                repeat: -1
            });

            if (pointer.x == sprite.x && pointer.y < sprite.y) {
                sprite.anims.play('back', true);
            } else if (pointer.x == sprite.x && pointer.y > sprite.y) {
                sprite.anims.play('front', true);
            } else {
                const slope = Math.abs((pointer.y - sprite.y) / (pointer.x - sprite.x))
                if (pointer.x < sprite.x && slope <= 1) {
                    sprite.anims.play('left', true);
                } else if (pointer.x > sprite.x && slope <= 1) {
                    sprite.anims.play('right', true);
                }
                if (pointer.x < sprite.x && slope > 1) {
                    sprite.anims.play('back', true);
                } else if (pointer.x > sprite.x && slope > 1) {
                    sprite.anims.play('front', true);
                }
            }
        });



        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }

    create() {

        this.add.text(50, 50, "Adventure awaits!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('demo1'));
        });
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Intro, Demo1, Demo2, Outro],
    title: "Adventure Game",
});

