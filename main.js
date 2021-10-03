const $ = document.querySelector.bind(document);
const $$= document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio =   $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn =$('.btn-repeat')
const playList =$('.playlist')

const app = {
    isRandom: false,
    isPlaying: false,
    currentIndex : 0,
    isRepeat: false,
    songs: [
       { name: 'name1',
         singer: 'singer1',
         path: './music/music1.mp3',
         image :'./img/img1.jpg'
       },
       { name: 'name2',
         singer: 'singer2',
         path: './music/music2.mp3',
         image :'./img/img2.jpg'
       },
       { name: 'name3',
         singer: 'singer3',
         path: './music/music3.mp3',
         image :'./img/img3.jpg'
       },
       { name: 'name4',
         singer: 'singer4',
         path: './music/music4.mp3',
         image :'./img/img4.jpg'
       },
       { name: 'name5',
         singer: 'singer5',
         path: './music/music5.mp3',
         image :'./img/img5.jpg'
       },
       { name: 'name6',
         singer: 'singer6',
         path: './music/music6.mp3',
         image :'./img/img6.jpg'
       },
       { name: 'name7',
         singer: 'singer7',
         path: './music/music7.mp3',
         image :'./img/img7.jpg'
       },
       { name: 'name8',
         singer: 'singer8',
         path: './music/music8.mp3',
         image :'./img/img8.jpg'
       }


    ],
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
          Object.defineProperty(this, "currentSong", {
            get: function () {
              return this.songs[this.currentIndex];
            }
          });
        },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth 
        //cd quay
        const cdThumbAnimate = cdThumb.animate([
          {transform:'rotate(360deg)'}
        ],{
          duration: 10000,
          iterations: Infinity,
        })
        cdThumbAnimate.pause()

        //xu ly phong to thu nho cd
        document.onscroll= function (){
          const scrollTop = window.scrollY||document.documentElement.scrollTop;
          const newcdWidth = cdWidth - scrollTop 
          cd.style.width = newcdWidth > 0 ? newcdWidth+'px':0
          cd.style.opacity =newcdWidth/cdWidth
          
        }
        //xu ly khi click play
        playBtn.onclick = function () {
          if(_this.isPlaying){
            audio.pause()
          }else{
            audio.play()
          }
         
        }
        //khi song duoc play 
        audio.onplay = function () {
          _this.isPlaying=true
          player.classList.add('playing')
          cdThumbAnimate.play()
        }
        // khi song bi pause
        audio.onpause = function () {
          _this.isPlaying=false
          player.classList.remove('playing')
          cdThumbAnimate.pause()
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime/audio.duration*100)
            progress.value = progressPercent
          }
        }
        //xu ly khi tua songs
        progress.onchange = function (e) {
          const seekTime =(audio.duration/100*e.target.value)
          audio.currentTime = seekTime
        }
        //khi next Song
        nextBtn.onclick =function () {
          if(_this.isRandom){
            _this.playRandomSong()
          }
          else{
            _this.nextSong()
          }
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }
        //khi prev song
        prevBtn.onclick= function () {
          if(_this.isRandom){
            _this.playRandomSong()
          }
          else{
            _this.prevSong()
          }
          audio.play()
        }
        //xu li khi het bai thi nẽt bai khac
        audio.onended = function () {
          if(_this.isRepeat)
          { 
            audio.play()
          }
          else {nextBtn.click()}
        }
        //random
        randomBtn.onclick = function () {
          _this.isRandom=!_this.isRandom
          randomBtn.classList.toggle('active',_this.isRandom)
        }
        //repeat song
        repeatBtn.onclick = function () {
          _this.isRepeat = !_this.isRepeat
          repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //lang nghe click hanh vi vao playlist
        playList.onclick = function (e) {
          const songNode = e.target.closest('.song:not(.active)')
          //xu ly khi click vao song
          if(songNode||e.target.closest('option')){
            if(songNode){
             _this.currentIndex = Number(songNode.dataset.index)
             _this.loadCurrentSong()
             _this.render()
             audio.play()
             

            }
            if(e.target.closest('option')){

            }
          }
        }

    },
    scrollToActiveSong: function() {
      setTimeout(()=>{
        $('.song.active').scrollIntoView(
          { 
            behavior:'smooth',
            block:'center',
          }
        )
      },300)
    },
    loadCurrentSong: function () {
      
      heading.textContent = app.currentSong.name
      cdThumb.style.backgroundImage = `url('${app.currentSong.image}')`
      audio.src = app.currentSong.path
    },
    //chuyen bai thuan
    nextSong:function () {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0}
      this.loadCurrentSong()
    },
    //chuyen bai nghich
    prevSong:function () {
      this.currentIndex--
      if(this.currentIndex <0){
      this.currentIndex = this.songs.length-1}
      this.loadCurrentSong()
    },
    //chuyen bai random
    playRandomSong :function () {
      let newIndex
      do{
        newIndex = Math.floor(Math.random()* this.songs.length)
      }while(newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    start: function(){
      //Dinh nghia thuoc thinh cho object
        this.defineProperties()
      // lang nghe cac su kien
        this.handleEvents()

        this.loadCurrentSong()
        
        this.render()
    }
}
app.start()