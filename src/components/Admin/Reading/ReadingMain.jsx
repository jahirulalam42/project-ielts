import React from 'react'
import Link from 'next/link'

const ReadingMain = () => {
  return (
    <div>
      <h1>This is the main Reading Page</h1> <br />
      <Link href={"reading/testadd"}>Add Test</Link>
      <br />
      <Link href={"reading/passageadd"}>Add passage</Link>
      <br />
      <Link href={"reading/questionadd"}>Add question</Link>
    </div>
  )
}

export default ReadingMain
