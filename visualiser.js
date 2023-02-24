function main() {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Bar {
        constructor(x, y, width, height, color, i) {
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.color = color
            this.i = i
            this.ease = 0.03
        }
        update(micInput) {
            const sound = micInput*700
            if (sound > this.height) {
                this.height = sound
            } else {
                this.height -= this.height*this.ease
            }
        }
        draw(context, volume){
            context.strokeStyle = this.color
            // context.fillRect(this.x, this.y, this.width, this.height)
            context.lineWidth = this.height  > 80 ? this.height/6 : 6
            context.save()

            context.translate(0, 0)
            context.scale(0.2, 0.2)
            context.rotate(this.i*0.03)
            context.scale(1 + volume*5, 1+volume*5)
            
            context.beginPath()
            context.moveTo(this.x, this.y)
            context.lineTo(this.y, this.height)
            // context.bezierCurveTo(100,100,this.height, this.height,this.x, this.y/1.5)
            context.stroke()
            context.rotate(this.i*0.02)
            context.strokeRect(this.y + this.i * 1.5, this.height/2, this.height/1.5, this.height)
            // context.lineWidth = this.height/40+20
            // context.beginPath()
            // context.arc(this.x+this.i*2.5, this.y, this.height*0.5, 0, Math.PI *2)
            // context.stroke()
            context.restore()
        }
    }

    const fftSize = 1024
    const microphone = new Microphone(fftSize)
    let bars = []
    let barWidth = canvas.width/(fftSize/2)
    function createBars() {
        for (let i = 0 ; i < fftSize/2; i++) {
            let color = `hsl(${i*2}, 100%, 50%)`
            bars.push(new Bar(0, i*1.5, 5, 20, color, i))
        }
    }
    createBars()
    let angle = 0

    function animate() {
        if (microphone.initialized){
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const samples = microphone.getSamples()
            const volume = microphone.getVolume()
            angle+=volume/1.5 + 0.01
            ctx.save()
            ctx.translate(canvas.width/2, canvas.height/2)
            ctx.rotate(angle)
            bars.forEach((bar, i) => {
                bar.update(samples[i])
                bar.draw(ctx, volume)
             })

             ctx.restore()
        }
        
        requestAnimationFrame(animate)
    }
    animate()
}
