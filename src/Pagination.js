import { useGridContextDispatch, useGridContext } from "./GridContext";
import {useState} from "react";

export default function Pagination() {

  const dispatch = useGridContextDispatch();
  const {currentPage, pageCount} = useGridContext();
  const [size,setSize] = useState(10);

  const onPrevious = ()=>{
    dispatch({
      type : "on_pagination",
      name : "previous"
    });
  };
  const onFirst = ()=>{
    dispatch({
      type : "on_pagination",
      name : "first"
    });
  };
  const onNext = ()=>{
    dispatch({
      type : "on_pagination",
      name : "next"
    });
  };
  const onLast = ()=>{
    dispatch({
      type : "on_pagination",
      name : "last"
    });
  };
  const onSize = (size)=>{
    setSize(size);
    dispatch({
      type : "on_pagination",
      name : "size",
      size : size
    });
    dispatch({ type:"on_pagination", name: "first"});
  }



  return (
    <>
      <button onClick={onPrevious}>{'<'}</button>
      <button onClick={onFirst}>{'<<'}</button>
      <button onClick={onNext}>{'>'}</button>
      <button onClick={onLast}>{'>>'}</button>
      <select value={size} onChange={(e)=>{onSize(e.target.value)}}>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span>| Page {currentPage + 1} of {pageCount}</span>
    </>
  );
}