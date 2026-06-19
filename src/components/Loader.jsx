function Loader({ text = "Loading..." }) {
  return (
    <div className="spinner">
      <div className="ring" />
      <p>{text}</p>
    </div>
  );
}

export default Loader;
