export default function PointList({
  title,
  points = [],      // ⭐ DEFAULT VALUE
  setPoints,
  placeholder
}) {
  const addPoint = () => {
    setPoints([...(points || []), ""]);
  };

  const updatePoint = (index, value) => {
    const updated = [...(points || [])];
    updated[index] = value;
    setPoints(updated);
  };

  const removePoint = (index) => {
    setPoints((points || []).filter((_, i) => i !== index));
  };

  return (
    <div className="border p-4 rounded">
      {title && <h2 className="font-heading text-xl mb-3">{title}</h2>}

      {(points || []).map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder={placeholder}
            value={p}
            onChange={(e) => updatePoint(i, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removePoint(i)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addPoint}
        className="mt-2 bg-palmGreen text-white px-4 py-2 rounded"
      >
        + Add Point
      </button>
    </div>
  );
}
