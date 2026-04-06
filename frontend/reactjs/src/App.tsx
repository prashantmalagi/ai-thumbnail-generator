import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import YTPreview from "./pages/YTPreview";
import MyGeneration from "./pages/MyGeneration";
import Login from "./components/Login";
import MyContact from "./pages/MyContact";

export default function App() {
  return (
    <>
      <LenisScroll />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generation/:id" element={<Generate />} />
        <Route path="/my-generation" element={<MyGeneration />} />
        <Route path="/MyContact" element={<MyContact />} />
        <Route path="/yt-preview" element={<YTPreview />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}