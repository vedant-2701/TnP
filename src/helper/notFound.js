import { animate } from 'animejs';

export function notFound() {
    animate('.row svg', {
        translateY: 10,
        autoplay: true,
        loop: true,
        ease: 'easeInOutSine',
        alternate: true,
    });
      
    animate('#zero', {
        x: 5,
        autoplay: true,
        loop: true,
        ease: 'easeInOutSine',
        scale: [
            {to: 1}, 
            {to: 1.3}, 
            {to: 1, delay: 250}
        ],
        rotateY: {
            to: 180,
            delay: 250,
        },
        alternate: true,
    });
}

export function notFoundCleanUp () {
    // Cleanup function to stop animations when component unmounts
    return () => {
        animate.remove('.row svg');
        animate.remove('#zero');
    };
}
  
  
  