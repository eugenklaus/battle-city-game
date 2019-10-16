;(function () {
    'use strict'
    
    class Loader {
        constructor () {
            // Downloads in queue
            this.loadOrder = {
                images: [],
                jsons: []
            }
            // Loaded resources
            this.resources = {
                images: [],
                jsons: []
            }
        }
        // Possibility to add an image to LoadOrder
        addImage (name, src) {
            // Adds data in a sequence to load
            this.loadOrder.images.push({ name, src })
        }
        // Possibility to add an Json Data (Person Data) to LoadOrder
        addJson (name, address) {
            // Adds data in a sequence to load
            this.loadOrder.jsons.push({ name, address })
        }
        // Function which is called after all images, Json file have been loaded.
        load (callback) {
            const promises = []
            // Load all Images: Loop goes all elements in the LoadOrder that are to be loaded through.
            for (const imageData of this.loadOrder.images) {
                const { name, src } = imageData

                const promise = Loader
                    .loadImage(src)
                    .then(image => {
                        // Remove image from load queue: Removes recording about the necessity of loading this image
                        this.resources.images[name] = image
                        // Removes recording about the necessity of loading this image
                        if (this.loadOrder.images.includes(imageData)) {
                            const index = this.loadOrder.images.indexOf(imageData)
                            this.loadOrder.images.splice(index, 1)
                        }
                    })
                promises.push(promise)
            }
            // Function load Jason Data
            for (const jsonData of this.loadOrder.jsons) {
                const { name, address } = jsonData

                const promise = Loader
                    .loadJson(address)
                    .then(json => {
                        this.resources.jsons[name] = json
                        
                        if (this.loadOrder.jsons.includes(jsonData)) {
                            const index = this.loadOrder.jsons.indexOf(jsonData)
                            this.loadOrder.jsons.splice(index, 1)
                        }
                    })

                promises.push(promise)
            }
            // Wait here until all promises are fulfilled and all data (pictures,json,sounds) have been loaded then callback method is executed            
            Promise.all(promises).then(callback)
        }

        // Function load Images
        static loadImage (src) {
            return new Promise((resolve, reject) => {
                try {
                    const image = new Image
                    image.onload = () => resolve(image)
                    image.src = src
                }
                // Return the mistake if something went wrong
                catch (err) {
                   reject(err) 
                }
            })
        }
        // Function load Json Data
        static loadJson (address) {
            return new Promise((resolve, reject) => {
                fetch(address)
                    .then(result => result.json())
                    .then(result => resolve(result))
                    .catch(err => reject(err))
            })
        }
    }
    
    window.GameEngine = window.GameEngine || {}
    window.GameEngine.Loader = Loader
    
})();