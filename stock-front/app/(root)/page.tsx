"use client"

import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchUsers, increment } from "@/slices/userSlice"
import { AppDispatch, RootState } from "@/store/store"

const Home = () => {
  const { entities, loading, value } = useSelector(
    (state: RootState) => state.user,
  )
  const userRef = useRef(false)
  const dispatch = useDispatch<AppDispatch>()

  console.log("loading: ", loading)

  useEffect(() => {
    if (userRef.current === false) {
      dispatch(fetchUsers())
    }
    return () => {
      userRef.current = true
    }
  }, [dispatch])

  console.log(entities)

  return (
    <div className="ml-[3rem] md:ml-[11rem]">
      {value}
      <button onClick={() => dispatch(increment())}>Click me</button>
      {loading && <h1>Loading</h1>}
    </div>
  )
}

export default Home
