import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import interact from 'interactjs'

const Home = () => {
  const [inputTop, setInputTop] = useState(0)
  const [inputLeft, setInputLeft] = useState(0)
  const certificateRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const certificate = certificateRef.current
    const input = inputRef.current

    if (certificate && input) {
      setInputTop(certificate.offsetTop + 50)
      setInputLeft(certificate.offsetLeft + 50)
    }
  }, [certificateRef, inputRef])

  useEffect(() => {
    // target elements with the "draggable" class
    interact('.draggable').draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      // enable autoScroll
      autoScroll: true,

      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener,

        // call this function on every dragend event
        end(event) {
          var textEl = event.target.querySelector('p')
          setInputTop(inputRef.current.offsetTop)
          setInputLeft(inputRef.current.offsetLeft)
          textEl &&
            (textEl.textContent =
              'moved a distance of ' +
              Math.sqrt(
                (Math.pow(event.pageX - event.x0, 2) +
                  Math.pow(event.pageY - event.y0, 2)) |
                  0
              ).toFixed(2) +
              'px')
        },
      },
    })

    function dragMoveListener(event) {
      var target = event.target
      var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      // translate the element
      target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)

      setInputTop(event.clientY)
      setInputLeft(event.clientX)
    }

    // this function is used later in the resizing and gesture demos
    window.dragMoveListener = dragMoveListener

    interact('.resize-drag')
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        listeners: {
          move(event) {
            var target = event.target
            var x = parseFloat(target.getAttribute('data-x')) || 0
            var y = parseFloat(target.getAttribute('data-y')) || 0

            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'

            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top

            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            target.textContent =
              Math.round(event.rect.width) +
              '\u00D7' +
              Math.round(event.rect.height)
          },
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent',
          }),

          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 100, height: 50 },
          }),
        ],

        inertia: true,
      })
      .draggable({
        listeners: { move: window.dragMoveListener },
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true,
          }),
        ],
      })
  }, [inputRef])
  useEffect(() => {
    console.log(inputTop, inputLeft)
  }, [inputTop, inputLeft])
  return (
    <div className='h-screen overflow-hidden'>
      <Head>
        <title>Dnd</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <input
        className='resize-drag'
        ref={inputRef}
        type='text'
        id='input-field'
        style={{
          position: 'absolute',
          top: inputTop,
          left: inputLeft,
        }}
      />
      <img
        src='/test.jpg'
        alt='test'
        className='absolute inset-0 w-96 ml-auto -z-10'
        ref={certificateRef}
        id='certificate'
      />
    </div>
  )
}

export default Home
