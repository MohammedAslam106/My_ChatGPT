
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { TbArrowBadgeRightFilled,TbBrandOpenai, TbUserCircle } from "react-icons/tb";
import BouncingDotsLoader from './components/Animation';


function App() {
  const [content, setContent] = useState('')
  const [responses,setResponses]=useState([])
  const [contents,setContents]=useState([])
  const [emptyInputTag,setEmptyInputTag]=useState('')
  const bottomRef=useRef(null)
  const SECRETE_KEY=import.meta.env.VITE_SECRETE_KEY

  async function openAI (){
    const response = await (await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": `${content}` }],
        temperature: 0.7
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRETE_KEY}`
      }
    })).json()

    const responseString = response.choices[0].message.content;
    console.log(responseString)
    setResponses((pre)=>[...pre,response.choices[0].message.content])
  }
  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  },[contents,responses])

  return (
    <div className='relative mx-10 my-5 flex flex-col justify-center items-center'>
      <div className='p-4 flex flex-col justify-center gap-8 w-full mb-16'>
      {contents.map((cont,ind)=>{
        return (<div  key={ind} className=' p-5 shadow-lg rounded-lg flex flex-col gap-2 text-white'>
          <div>
            <TbUserCircle size={35} className=' text-white bg-gray-600 p-1 mb-2 rounded-lg'/>
            <pre className='  bg-gray-600 p-3 px-4 shadow-sm rounded-xl' style={{overflow:'auto', whiteSpace:'pre-wrap',wordWrap:'break-word',fontFamily:'sans-serif'}}>
                  {cont}
              </pre>
          </div>
          <div>
              <TbBrandOpenai size={35} className=' bg-green-400 text-white p-1 mb-2 rounded-lg'/>
              {responses[ind] ? <pre className=' bg-gray-600 p-3 px-4 shadow-sm rounded-xl' style={{overflow:'auto', whiteSpace:'pre-wrap',wordWrap:'break-word',fontFamily:'sans-serif'}}>
                  {responses[ind]}
              </pre> :<BouncingDotsLoader/> }
              
          </div>
        </div>)
      })}
      <div ref={bottomRef}/>
      </div>
      <div className=' w-full fixed bottom-5 my-5 flex justify-center items-center gap-3'>
        <input  value={emptyInputTag} onKeyDown={(e)=>{
          if (e.key==='Enter' && responses.length===contents.length && !e.shiftKey){
            console.log('pressed enter')
            setEmptyInputTag('')
            setContents((pre)=>[...pre,content])
            openAI()
          }
        }} 
        placeholder='Send message...'
        onChange={(e) => {
          setEmptyInputTag(e.target.value)
          setContent(e.target.value)}} type="text" className=' shadow-md w-[80%] p-2 px-5 border border-gray-800 text-gray-700 rounded-lg' />
        <button onClick={()=>{
          if (responses.length===contents.length){
              setEmptyInputTag('')
              setContents((pre)=>[...pre,content])
              openAI()
          }
          }}  className=' bg-gray-100 hover:opacity-75 cursor-pointer text-blue-400 border border-gray-400 rounded shadow-sm'>
          <TbArrowBadgeRightFilled size={40} />
        </button>
      </div>
      </div>
  )
}

export default App