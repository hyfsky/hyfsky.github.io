/* ImageFlow constructor */
function ImageFlow() {
    this.defaults =
	{
	    animationSpeed: 50,
	    aspectRatio: 2.3,
	    buttons: false,
	    captions: true,
	    circular: true,
	    imageCursor: 'pointer',
	    ImageFlowID: 'imageflow',
	    imageFocusM: 1.0,
	    imageFocusMax: 3,
	    imagePath: '',
	    imageScaling: true,
	    imagesHeight: 0.65,           /* 高宽比例 */
	    imagesM: 1.2,            /* 图片深度 */
	    onClick: function () { document.location = this.url; },
	    opacity: false,
	    opacityArray: [10, 8, 6, 4, 2],
	    percentLandscape: 118,
	    percentOther: 120,
	    preloadImages: true,
	    reflections: true,
	    reflectionGET: '',
	    reflectionP: 0.5,
	    reflectionPNG: false,
	    reflectPath: '',
	    scrollbarP: 0.6,
	    slider: true,
	    sliderCursor: 'e-resize',
	    sliderWidth: 14,
	    slideshow: true,
	    slideshowSpeed: 3000,
	    slideshowAutoplay: true,
	    startID: 1,
	    glideToStartID: true,
	    startAnimation: false,
	    xStep: 90
	};



    var my = this;

    this.init = function (options) {

        for (var name in my.defaults) {
            this[name] = (options !== undefined && options[name] !== undefined) ? options[name] : my.defaults[name];
        }


        var ImageFlowDiv = document.getElementById(my.ImageFlowID);
        if (ImageFlowDiv) {
            ImageFlowDiv.style.visibility = 'visible';
            this.ImageFlowDiv = ImageFlowDiv;


            if (this.createStructure()) {
                this.imagesDiv = document.getElementById(my.ImageFlowID + '_images');
                this.captionDiv = document.getElementById(my.ImageFlowID + '_caption');
                this.navigationDiv = document.getElementById(my.ImageFlowID + '_navigation');
                this.scrollbarDiv = document.getElementById(my.ImageFlowID + '_scrollbar');
                this.sliderDiv = document.getElementById(my.ImageFlowID + '_slider');
                this.buttonNextDiv = document.getElementById(my.ImageFlowID + '_next');
                this.buttonPreviousDiv = document.getElementById(my.ImageFlowID + '_previous');
                this.buttonSlideshow = document.getElementById(my.ImageFlowID + '_slideshow');

                this.indexArray = [];
                this.current = 0;
                this.imageID = 0;
                this.target = 0;
                this.memTarget = 0;
                this.firstRefresh = true;
                this.firstCheck = true;
                this.busy = false;

                var width = this.ImageFlowDiv.offsetWidth;
                var height = Math.round(width / my.aspectRatio);
                document.getElementById(my.ImageFlowID + '_loading_txt').style.paddingTop = ((height * 0.5) - 22) + 'px';
                ImageFlowDiv.style.height = height + 'px';

                this.loadingProgress();
            }
        }
    };


    this.createStructure = function () {
        var imagesDiv = my.Helper.createDocumentElement('div', 'images');

        var node, version, src, imageNode;
        var max = my.ImageFlowDiv.childNodes.length;
        for (var index = 0; index < max; index++) {
            node = my.ImageFlowDiv.childNodes[index];
            if (node && node.nodeType == 1 && node.nodeName == 'IMG') {
                if (my.reflections === true) {
                    version = (my.reflectionPNG) ? '3' : '2';
                    src = my.imagePath + node.getAttribute('src', 2);
                    node.setAttribute('src', src);
                }

                imageNode = node.cloneNode(true);
                imagesDiv.appendChild(imageNode);
            }
        }

        if (my.circular) {
            var first = my.Helper.createDocumentElement('div', 'images');
            var last = my.Helper.createDocumentElement('div', 'images');

            max = imagesDiv.childNodes.length;
            if (max < my.imageFocusMax) {
                my.imageFocusMax = max;
            }

            if (max > 1) {
                var i;
                for (i = 0; i < max; i++) {
                    node = imagesDiv.childNodes[i];
                    if (i < my.imageFocusMax) {
                        imageNode = node.cloneNode(true);
                        first.appendChild(imageNode);
                    }
                    if (max - i < my.imageFocusMax + 1) {
                        imageNode = node.cloneNode(true);
                        last.appendChild(imageNode);
                    }
                }

                for (i = 0; i < max; i++) {
                    node = imagesDiv.childNodes[i];
                    imageNode = node.cloneNode(true);
                    last.appendChild(imageNode);
                }
                for (i = 0; i < my.imageFocusMax; i++) {
                    node = first.childNodes[i];
                    imageNode = node.cloneNode(true);
                    last.appendChild(imageNode);
                }

                imagesDiv = last;
            }
        }

        if (my.slideshow) {
            var slideshowButton = my.Helper.createDocumentElement('div', 'slideshow');
            imagesDiv.appendChild(slideshowButton);
        }

        var loadingP = my.Helper.createDocumentElement('p', 'loading_txt');
        var loadingText = document.createTextNode(' ');
        loadingP.appendChild(loadingText);

        var loadingDiv = my.Helper.createDocumentElement('div', 'loading');

        var loadingBarDiv = my.Helper.createDocumentElement('div', 'loading_bar');
        loadingDiv.appendChild(loadingBarDiv);

        var captionDiv = my.Helper.createDocumentElement('div', 'caption');

        var scrollbarDiv = my.Helper.createDocumentElement('div', 'scrollbar');
        var sliderDiv = my.Helper.createDocumentElement('div', 'slider');
        scrollbarDiv.appendChild(sliderDiv);
        if (my.buttons) {
            var buttonPreviousDiv = my.Helper.createDocumentElement('div', 'previous', 'button');
            var buttonNextDiv = my.Helper.createDocumentElement('div', 'next', 'button');
            scrollbarDiv.appendChild(buttonPreviousDiv);
            scrollbarDiv.appendChild(buttonNextDiv);
        }

        var navigationDiv = my.Helper.createDocumentElement('div', 'navigation');
        navigationDiv.appendChild(captionDiv);
        navigationDiv.appendChild(scrollbarDiv);

        var success = false;
        if (my.ImageFlowDiv.appendChild(imagesDiv) &&
			my.ImageFlowDiv.appendChild(loadingP) &&
			my.ImageFlowDiv.appendChild(loadingDiv) &&
			my.ImageFlowDiv.appendChild(navigationDiv)) {
            max = my.ImageFlowDiv.childNodes.length;
            for (index = 0; index < max; index++) {
                node = my.ImageFlowDiv.childNodes[index];
                if (node && node.nodeType == 1 && node.nodeName == 'IMG') {
                    my.ImageFlowDiv.removeChild(node);
                }
            }
            success = true;
        }
        return success;
    };


    this.loadingProgress = function () {
        var p = my.loadingStatus();
        if ((p < 100 || my.firstCheck) && my.preloadImages) {
            if (my.firstCheck && p == 100) {
                my.firstCheck = false;
                window.setTimeout(my.loadingProgress, 100);
            }
            else {
                window.setTimeout(my.loadingProgress, 40);
            }
        }
        else {
            document.getElementById(my.ImageFlowID + '_loading_txt').style.display = 'none';
            document.getElementById(my.ImageFlowID + '_loading').style.display = 'none';

            window.setTimeout(my.Helper.addResizeEvent, 1000);

            my.refresh();

            if (my.max > 1) {
                my.MouseWheel.init();
                my.MouseDrag.init();
                my.Touch.init();
                my.Key.init();

                if (my.slideshow) {
                    my.Slideshow.init();
                }

                if (my.slider) {
                    my.scrollbarDiv.style.visibility = 'visible';
                }
            }
        }
    };


    this.loadingStatus = function () {
        var max = my.imagesDiv.childNodes.length;
        var i = 0, completed = 0;
        var image = null;
        for (var index = 0; index < max; index++) {
            image = my.imagesDiv.childNodes[index];
            if (image && image.nodeType == 1 && image.nodeName == 'IMG') {
                if (image.complete) {
                    completed++;
                }
                i++;
            }
        }

        var finished = Math.round((completed / i) * 100);
        var loadingBar = document.getElementById(my.ImageFlowID + '_loading_bar');
        loadingBar.style.width = finished + '%';

        if (my.circular) {
            i = i - (my.imageFocusMax * 2);
            completed = (finished < 1) ? 0 : Math.round((i / 100) * finished);
        }

        var loadingP = document.getElementById(my.ImageFlowID + '_loading_txt');
        var loadingTxt = document.createTextNode('正在加载,请稍候 ' + completed + '/' + i);
        loadingP.replaceChild(loadingTxt, loadingP.firstChild);
        return finished;
    };


    this.refresh = function () {
        this.imagesDivWidth = my.imagesDiv.offsetWidth + my.imagesDiv.offsetLeft;
        this.maxHeight = Math.round(my.imagesDivWidth / my.aspectRatio);
        this.maxFocus = my.imageFocusMax * my.xStep;
        this.size = my.imagesDivWidth * 0.5;
        this.sliderWidth = my.sliderWidth * 0.5;
        this.scrollbarWidth = (my.imagesDivWidth - (Math.round(my.sliderWidth) * 2)) * my.scrollbarP;
        this.imagesDivHeight = Math.round(my.maxHeight * my.imagesHeight);

        my.ImageFlowDiv.style.height = my.maxHeight + 'px';

        my.imagesDiv.style.height = my.imagesDivHeight + 'px';

        my.navigationDiv.style.height = (my.maxHeight - my.imagesDivHeight) + 'px';

        my.captionDiv.style.width = my.imagesDivWidth + 'px';
        my.captionDiv.style.paddingTop = Math.round(my.imagesDivWidth * 0.02) + 'px';

        my.scrollbarDiv.style.width = my.scrollbarWidth + 'px';
        my.scrollbarDiv.style.marginTop = Math.round(my.imagesDivWidth * 0.02) + 'px';
        my.scrollbarDiv.style.marginLeft = Math.round(my.sliderWidth + ((my.imagesDivWidth - my.scrollbarWidth) / 2)) + 'px';

        my.sliderDiv.style.cursor = my.sliderCursor;
        my.sliderDiv.onmousedown = function () { my.MouseDrag.start(this); return false; };

        if (my.buttons) {
            my.buttonPreviousDiv.onclick = function () { my.MouseWheel.handle(1); };
            my.buttonNextDiv.onclick = function () { my.MouseWheel.handle(-1); };
        }

        var multi = (my.reflections === true) ? my.reflectionP + 1 : 1;

        var max = my.imagesDiv.childNodes.length;
        var i = 0;
        var image = null;
        for (var index = 0; index < max; index++) {
            image = my.imagesDiv.childNodes[index];
            if (image !== null && image.nodeType == 1 && image.nodeName == 'IMG') {
                this.indexArray[i] = index;

                image.url = image.getAttribute('longdesc');
                image.xPosition = (-i * my.xStep);
                image.i = i;

                if (my.firstRefresh) {
                    if (image.getAttribute('width') !== null && image.getAttribute('height') !== null) {
                        image.w = image.getAttribute('width');
                        image.h = image.getAttribute('height') * multi;
                    }
                    else {
                        image.w = image.width;
                        image.h = image.height;
                    }
                }

                if ((image.w) > (image.h / (my.reflectionP + 1))) {
                    image.pc = my.percentLandscape;
                    image.pcMem = my.percentLandscape;
                }
                else {
                    image.pc = my.percentOther;
                    image.pcMem = my.percentOther;
                }

                if (my.imageScaling === false) {
                    image.style.position = 'relative';
                    image.style.display = 'inline';
                }

                image.style.cursor = my.imageCursor;
                i++;
            }
        }
        this.max = my.indexArray.length;

        if (my.imageScaling === false) {
            image = my.imagesDiv.childNodes[my.indexArray[0]];

            this.totalImagesWidth = image.w * my.max;
            image.style.paddingLeft = (my.imagesDivWidth / 2) + (image.w / 2) + 'px';

            my.imagesDiv.style.height = image.h + 'px';
            my.navigationDiv.style.height = (my.maxHeight - image.h) + 'px';
        }

        if (my.firstRefresh) {
            my.firstRefresh = false;

            my.imageID = my.startID - 1;
            if (my.imageID < 0) {
                my.imageID = 0;
            }

            if (my.circular) {
                my.imageID = my.imageID + my.imageFocusMax;
            }

            maxId = (my.circular) ? (my.max - (my.imageFocusMax)) - 1 : my.max - 1;
            if (my.imageID > maxId) {
                my.imageID = maxId;
            }

            if (my.glideToStartID === false) {
                my.moveTo(-my.imageID * my.xStep);
            }

            if (my.startAnimation) {
                my.moveTo(5000);
            }
        }

        if (my.max > 1) {
            my.glideTo(my.imageID);
        }

        my.moveTo(my.current);
    };


    this.moveTo = function (x)
    {
        this.current = x;
        this.zIndex = my.max;

        for (var index = 0; index < my.max; index++)
        {
            var image = my.imagesDiv.childNodes[my.indexArray[index]];
            var currentImage = index * -my.xStep;

            if (my.imageScaling)
            {
                if ((currentImage + my.maxFocus) < my.memTarget || (currentImage - my.maxFocus) > my.memTarget)
                {
                    try
                    {
                        image.style.visibility = 'hidden';
                        image.style.display = 'none';
                    }
                    catch (e)
                    { }
                }
                else
                {
                    try
                    {
                        var z = (Math.sqrt(10000 + x * x) + 100) * my.imagesM;
                        var xs = x / z * my.size + my.size;

                        image.style.display = 'block';

                        var newImageH = (image.h / image.w * image.pc) / z * my.size;
                        var newImageW = 0;
                        switch (newImageH > my.maxHeight)
                        {
                            case false:
                                newImageW = image.pc / z * my.size;
                                break;

                            default:
                                newImageH = my.maxHeight;
                                newImageW = image.w * newImageH / image.h;
                                break;
                        }

                        var newImageTop = (my.imagesDivHeight - newImageH) + ((newImageH / (my.reflectionP + 1)) * my.reflectionP);

                        image.style.left = xs - (image.pc / 2) / z * my.size + 'px';
                        if (newImageW && newImageH)
                        {
                            image.style.height = newImageH + 'px';
                            image.style.width = newImageW + 'px';
                            image.style.top = newImageTop + 'px';
                        }
                        image.style.visibility = 'visible';

                        switch (x < 0)
                        {
                            case true:
                                this.zIndex++;
                                break;

                            default:
                                this.zIndex = my.zIndex - 1;
                                break;
                        }

                        switch (image.i == my.imageID)
                        {
                            case false:
                                image.onclick = function () { my.glideTo(this.i); };
                                break;

                            default:
                                this.zIndex = my.zIndex + 1;
                                if (image.url !== '')
                                {
                                    image.onclick = my.onClick;
                                }
                                break;
                        }
                        image.style.zIndex = my.zIndex;
                    }
                    catch (e)
                    { }
                }
            }

            else
            {
                if ((currentImage + my.maxFocus) < my.memTarget || (currentImage - my.maxFocus) > my.memTarget)
                {
                    image.style.visibility = 'hidden';
                }
                else
                {
                    image.style.visibility = 'visible';

                    switch (image.i == my.imageID)
                    {
                        case false:
                            image.onclick = function () { my.glideTo(this.i); };
                            break;

                        default:
                            if (image.url !== '')
                            {
                                image.onclick = my.onClick;
                            }
                            break;
                    }
                }
                my.imagesDiv.style.marginLeft = (x - my.totalImagesWidth) + 'px';
            }

            x += my.xStep;
        }
    };


    this.glideTo = function (imageID)
    {
        var jumpTarget, clonedImageID;
        if (my.circular)
        {
            if (imageID + 1 === my.imageFocusMax)
            {
                clonedImageID = my.max - my.imageFocusMax;
                jumpTarget = -clonedImageID * my.xStep;

                imageID = clonedImageID - 1;
            }

            if (imageID === (my.max - my.imageFocusMax))
            {
                clonedImageID = my.imageFocusMax - 1;
                jumpTarget = -clonedImageID * my.xStep;

                imageID = clonedImageID + 1;
            }
        }

        var x = -imageID * my.xStep;
        this.target = x;
        this.memTarget = x;
        this.imageID = imageID;

        var caption = "";
        try
        {
            caption = my.imagesDiv.childNodes[imageID].getAttribute('alt');
        }
        catch (e)
        { 
        }
        if (caption === '' || my.captions === false)
        {
            caption = '&nbsp;';
        }
        my.captionDiv.innerHTML = caption;

        if (my.MouseDrag.busy === false)
        {
            if (my.circular)
            {
                this.newSliderX = ((imageID - my.imageFocusMax) * my.scrollbarWidth) / (my.max - (my.imageFocusMax * 2) - 1) - my.MouseDrag.newX;
            }
            else
            {
                this.newSliderX = (imageID * my.scrollbarWidth) / (my.max - 1) - my.MouseDrag.newX;
            }
            my.sliderDiv.style.marginLeft = (my.newSliderX - my.sliderWidth) + 'px';
        }

        if (my.opacity === true || my.imageFocusM !== my.defaults.imageFocusM)
        {
            my.Helper.setOpacity(my.imagesDiv.childNodes[imageID], my.opacityArray[0]);
            my.imagesDiv.childNodes[imageID].pc = my.imagesDiv.childNodes[imageID].pc * my.imageFocusM;

            var opacityValue = 0;
            var rightID = 0;
            var leftID = 0;
            var last = my.opacityArray.length;

            for (var i = 1; i < (my.imageFocusMax + 1); i++)
            {
                if ((i + 1) > last)
                {
                    opacityValue = my.opacityArray[last - 1];
                }
                else
                {
                    opacityValue = my.opacityArray[i];
                }

                rightID = imageID + i;
                leftID = imageID - i;

                if (rightID < my.max)
                {
                    my.Helper.setOpacity(my.imagesDiv.childNodes[rightID], opacityValue);
                    my.imagesDiv.childNodes[rightID].pc = my.imagesDiv.childNodes[rightID].pcMem;
                }
                if (leftID >= 0)
                {
                    my.Helper.setOpacity(my.imagesDiv.childNodes[leftID], opacityValue);
                    my.imagesDiv.childNodes[leftID].pc = my.imagesDiv.childNodes[leftID].pcMem;
                }
            }
        }

        if (jumpTarget)
        {
            my.moveTo(jumpTarget);
        }

        if (my.busy === false)
        {
            my.busy = true;
            my.animate();
        }
    };


    this.animate = function () {
        switch (my.target < my.current - 1 || my.target > my.current + 1) {
            case true:
                my.moveTo(my.current + (my.target - my.current) / 3);
                window.setTimeout(my.animate, my.animationSpeed);
                my.busy = true;
                break;

            default:
                my.busy = false;
                break;
        }
    };


    this.glideOnEvent = function (imageID) {
        if (my.slideshow) {
            my.Slideshow.interrupt();
        }

        my.glideTo(imageID);
    };


    this.Slideshow =
	{
	    direction: 1,

	    init: function () {
	        (my.slideshowAutoplay) ? my.Slideshow.start() : my.Slideshow.stop();
	    },

	    interrupt: function () {
	        my.Helper.removeEvent(my.ImageFlowDiv, 'click', my.Slideshow.interrupt);

	        my.Slideshow.stop();
	    },

	    addInterruptEvent: function () {
	        my.Helper.addEvent(my.ImageFlowDiv, 'click', my.Slideshow.interrupt);
	    },

	    start: function () {
	        my.Helper.setClassName(my.buttonSlideshow, 'slideshow pause');

	        my.buttonSlideshow.onclick = function () { my.Slideshow.stop(); };

	        my.Slideshow.action = window.setInterval(my.Slideshow.slide, my.slideshowSpeed);

	        window.setTimeout(my.Slideshow.addInterruptEvent, 100);
	    },

	    stop: function () {
	        my.Helper.setClassName(my.buttonSlideshow, 'slideshow play');

	        my.buttonSlideshow.onclick = function () { my.Slideshow.start(); };

	        window.clearInterval(my.Slideshow.action);
	    },

	    slide: function () {
	        var newImageID = my.imageID + my.Slideshow.direction;
	        var reverseDirection = false;

	        if (newImageID === my.max) {
	            my.Slideshow.direction = -1;
	            reverseDirection = true;
	        }

	        if (newImageID < 0) {
	            my.Slideshow.direction = 1;
	            reverseDirection = true;
	        }

	        (reverseDirection) ? my.Slideshow.slide() : my.glideTo(newImageID);
	    }
	};


    this.MouseWheel =
	{
	    init: function () {
	        if (window.addEventListener) {
	            my.ImageFlowDiv.addEventListener('DOMMouseScroll', my.MouseWheel.get, false);
	        }
	        my.Helper.addEvent(my.ImageFlowDiv, 'mousewheel', my.MouseWheel.get);
	    },

	    get: function (event) {
	        var delta = 0;
	        if (!event) {
	            event = window.event;
	        }
	        if (event.wheelDelta) {
	            delta = event.wheelDelta / 120;
	        }
	        else if (event.detail) {
	            delta = -event.detail / 3;
	        }
	        if (delta) {
	            my.MouseWheel.handle(delta);
	        }
	        my.Helper.suppressBrowserDefault(event);
	    },

	    handle: function (delta) {
	        var change = false;
	        var newImageID = 0;
	        if (delta > 0) {
	            if (my.imageID >= 1) {
	                newImageID = my.imageID - 1;
	                change = true;
	            }
	        }
	        else {
	            if (my.imageID < (my.max - 1)) {
	                newImageID = my.imageID + 1;
	                change = true;
	            }
	        }

	        if (change) {
	            my.glideOnEvent(newImageID);
	        }
	    }
	};


    this.MouseDrag =
	{
	    object: null,
	    objectX: 0,
	    mouseX: 0,
	    newX: 0,
	    busy: false,

	    init: function () {
	        my.Helper.addEvent(my.ImageFlowDiv, 'mousemove', my.MouseDrag.drag);
	        my.Helper.addEvent(my.ImageFlowDiv, 'mouseup', my.MouseDrag.stop);
	        my.Helper.addEvent(document, 'mouseup', my.MouseDrag.stop);

	        my.ImageFlowDiv.onselectstart = function () {
	            var selection = true;
	            if (my.MouseDrag.busy) {
	                selection = false;
	            }
	            return selection;
	        };
	    },

	    start: function (o) {
	        my.MouseDrag.object = o;
	        my.MouseDrag.objectX = my.MouseDrag.mouseX - o.offsetLeft + my.newSliderX;
	    },

	    stop: function () {
	        my.MouseDrag.object = null;
	        my.MouseDrag.busy = false;
	    },

	    drag: function (e) {
	        var posx = 0;
	        if (!e) {
	            e = window.event;
	        }
	        if (e.pageX) {
	            posx = e.pageX;
	        }
	        else if (e.clientX) {
	            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	        }
	        my.MouseDrag.mouseX = posx;

	        if (my.MouseDrag.object !== null) {
	            var newX = (my.MouseDrag.mouseX - my.MouseDrag.objectX) + my.sliderWidth;

	            if (newX < (-my.newSliderX)) {
	                newX = -my.newSliderX;
	            }
	            if (newX > (my.scrollbarWidth - my.newSliderX)) {
	                newX = my.scrollbarWidth - my.newSliderX;
	            }

	            var step, imageID;
	            if (my.circular) {
	                step = (newX + my.newSliderX) / (my.scrollbarWidth / (my.max - (my.imageFocusMax * 2) - 1));
	                imageID = Math.round(step) + my.imageFocusMax;
	            }
	            else {
	                step = (newX + my.newSliderX) / (my.scrollbarWidth / (my.max - 1));
	                imageID = Math.round(step);
	            }
	            my.MouseDrag.newX = newX;
	            my.MouseDrag.object.style.left = newX + 'px';
	            if (my.imageID !== imageID) {
	                my.glideOnEvent(imageID);
	            }
	            my.MouseDrag.busy = true;
	        }
	    }
	};


    this.Touch =
	{
	    x: 0,
	    startX: 0,
	    stopX: 0,
	    busy: false,
	    first: true,

	    init: function () {
	        my.Helper.addEvent(my.navigationDiv, 'touchstart', my.Touch.start);
	        my.Helper.addEvent(document, 'touchmove', my.Touch.handle);
	        my.Helper.addEvent(document, 'touchend', my.Touch.stop);
	    },

	    isOnNavigationDiv: function (e) {
	        var state = false;
	        if (e.touches) {
	            var target = e.touches[0].target;
	            if (target === my.navigationDiv || target === my.sliderDiv || target === my.scrollbarDiv) {
	                state = true;
	            }
	        }
	        return state;
	    },

	    getX: function (e) {
	        var x = 0;
	        if (e.touches) {
	            x = e.touches[0].pageX;
	        }
	        return x;
	    },

	    start: function (e) {
	        my.Touch.startX = my.Touch.getX(e);
	        my.Touch.busy = true;
	        my.Helper.suppressBrowserDefault(e);
	    },

	    isBusy: function () {
	        var busy = false;
	        if (my.Touch.busy) {
	            busy = true;
	        }
	        return busy;
	    },

	    handle: function (e) {
	        if (my.Touch.isBusy && my.Touch.isOnNavigationDiv(e)) {
	            var max = (my.circular) ? (my.max - (my.imageFocusMax * 2) - 1) : (my.max - 1);
	            if (my.Touch.first) {
	                my.Touch.stopX = (max - my.imageID) * (my.imagesDivWidth / max);
	                my.Touch.first = false;
	            }
	            var newX = -(my.Touch.getX(e) - my.Touch.startX - my.Touch.stopX);

	            if (newX < 0) {
	                newX = 0;
	            }
	            if (newX > my.imagesDivWidth) {
	                newX = my.imagesDivWidth;
	            }

	            my.Touch.x = newX;

	            var imageID = Math.round(newX / (my.imagesDivWidth / max));
	            imageID = max - imageID;
	            if (my.imageID !== imageID) {
	                if (my.circular) {
	                    imageID = imageID + my.imageFocusMax;
	                }
	                my.glideOnEvent(imageID);
	            }
	            my.Helper.suppressBrowserDefault(e);
	        }
	    },

	    stop: function () {
	        my.Touch.stopX = my.Touch.x;
	        my.Touch.busy = false;
	    }
	};


    this.Key =
	{
	    init: function () {
	        document.onkeydown = function (event) { my.Key.handle(event); };
	    },

	    handle: function (event) {
	        var charCode = my.Key.get(event);
	        switch (charCode) {
	            case 39:
	                my.MouseWheel.handle(-1);
	                break;

	            case 37:
	                my.MouseWheel.handle(1);
	                break;
	        }
	    },

	    get: function (event) {
	        event = event || window.event;
	        return event.keyCode;
	    }
	};


    this.Helper =
	{
	    addEvent: function (obj, type, fn) {
	        if (obj.addEventListener) {
	            obj.addEventListener(type, fn, false);
	        }
	        else if (obj.attachEvent) {
	            obj["e" + type + fn] = fn;
	            obj[type + fn] = function () { obj["e" + type + fn](window.event); };
	            obj.attachEvent("on" + type, obj[type + fn]);
	        }
	    },

	    removeEvent: function (obj, type, fn) {
	        if (obj.removeEventListener) {
	            obj.removeEventListener(type, fn, false);
	        }
	        else if (obj.detachEvent) {
	            if (obj[type + fn] === undefined) {
	                alert('Helper.removeEvent » Pointer to detach event is undefined - perhaps you are trying to detach an unattached event?');
	            }
	            obj.detachEvent('on' + type, obj[type + fn]);
	            obj[type + fn] = null;
	            obj['e' + type + fn] = null;
	        }
	    },

	    setOpacity: function (object, value) {
	        if (my.opacity === true) {
	            object.style.opacity = value / 10;
	            object.style.filter = 'alpha(opacity=' + value * 10 + ')';
	        }
	    },

	    createDocumentElement: function (type, id, optionalClass) {
	        var element = document.createElement(type);
	        element.setAttribute('id', my.ImageFlowID + '_' + id);
	        if (optionalClass !== undefined) {
	            id += ' ' + optionalClass;
	        }
	        my.Helper.setClassName(element, id);
	        return element;
	    },

	    setClassName: function (element, className) {
	        if (element) {
	            element.setAttribute('class', className);
	            element.setAttribute('className', className);
	        }
	    },

	    suppressBrowserDefault: function (e) {
	        if (e.preventDefault) {
	            e.preventDefault();
	        }
	        else {
	            e.returnValue = false;
	        }
	        return false;
	    },

	    addResizeEvent: function () {
	        var otherFunctions = window.onresize;
	        if (typeof window.onresize != 'function') {
	            window.onresize = function () {
	                my.refresh();
	            };
	        }
	        else {
	            window.onresize = function () {
	                if (otherFunctions) {
	                    otherFunctions();
	                }
	                my.refresh();
	            };
	        }
	    }
	};
}

var domReadyEvent =
{
    name: "domReadyEvent",
    events: {},
    domReadyID: 1,
    bDone: false,
    DOMContentLoadedCustom: null,

    add: function (handler) {
        if (!handler.$$domReadyID) {
            handler.$$domReadyID = this.domReadyID++;

            if (this.bDone) {
                handler();
            }

            this.events[handler.$$domReadyID] = handler;
        }
    },

    remove: function (handler) {
        if (handler.$$domReadyID) {
            delete this.events[handler.$$domReadyID];
        }
    },

    run: function () {
        if (this.bDone) {
            return;
        }

        this.bDone = true;

        for (var i in this.events) {
            this.events[i]();
        }
    },

    schedule: function () {
        if (this.bDone) {
            return;
        }

        if (/KHTML|WebKit/i.test(navigator.userAgent)) {
            if (/loaded|complete/.test(document.readyState)) {
                this.run();
            }
            else {
                setTimeout(this.name + ".schedule()", 100);
            }
        }
        else if (document.getElementById("__ie_onload")) {
            return true;
        }

        if (typeof this.DOMContentLoadedCustom === "function") {
            if (typeof document.getElementsByTagName !== 'undefined' && (document.getElementsByTagName('body')[0] !== null || document.body !== null)) {
                if (this.DOMContentLoadedCustom()) {
                    this.run();
                }
                else {
                    setTimeout(this.name + ".schedule()", 250);
                }
            }
        }
        return true;
    },

    init: function () {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function () { domReadyEvent.run(); }, false);
        }

        setTimeout("domReadyEvent.schedule()", 100);

        function run() {
            domReadyEvent.run();
        }

        if (typeof addEvent !== "undefined") {
            addEvent(window, "load", run);
        }
        else if (document.addEventListener) {
            document.addEventListener("load", run, false);
        }
        else if (typeof window.onload === "function") {
            var oldonload = window.onload;
            window.onload = function () {
                domReadyEvent.run();
                oldonload();
            };
        }
        else {
            window.onload = run;
        }
    }
};

var domReady = function (handler) { domReadyEvent.add(handler); };
domReadyEvent.init();


domReady(function ()
{
    var instanceOne = new ImageFlow();
    instanceOne.init({ ImageFlowID: 'starsIF',
        captions: false,
        slider: false,
        startID: Number($("#S_Num").val()) + 1
    });
});
