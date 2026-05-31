"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Box, Image as ImageIcon, Loader2 } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls, ContactShadows, Float, useGLTF } from "@react-three/drei";

function ModelPreview({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProductUploadModal({ isOpen, onClose, onSuccess }: ProductUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "media">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Gaming",
    description: "",
    stock: "10",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewModelUrl, setPreviewModelUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPreviewImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0]);
      setPreviewModelUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadFile = async (file: File, type: "image" | "model") => {
    const data = new FormData();
    data.append("file", file);
    data.append("type", type);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });
    if (!res.ok) throw new Error(`Failed to upload ${type}`);
    return res.json();
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !imageFile) {
      alert("Missing required fields or image asset.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress("Uploading 2D Asset...");

    try {
      const imageResult = await uploadFile(imageFile, "image");
      let modelResult = null;

      if (modelFile) {
        setUploadProgress("Uploading Holographic Payload...");
        modelResult = await uploadFile(modelFile, "model");
      }

      setUploadProgress("Initializing Asset in Database...");

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: imageResult.url,
          modelPath: modelResult ? modelResult.url : undefined,
          modelSize: modelResult ? modelResult.size : 0,
        }),
      });

      if (!res.ok) throw new Error("Database initialization failed");

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error(error);
      alert("Error: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-space-900/90 backdrop-blur-md"
          />
          
          <div className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl h-[80vh] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex pointer-events-auto"
            >
              {/* Left Side: Form */}
              <div className="w-1/2 flex flex-col border-r border-white/10 bg-space-900/50">
                <div className="p-6 border-b border-white/10 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/20 blur-3xl rounded-full pointer-events-none" />
                  <h2 className="font-display font-bold text-xl text-white flex items-center gap-2 relative z-10">
                    <Box className="w-5 h-5 text-neon-cyan" /> New Asset
                  </h2>
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex border-b border-white/10">
                  <button 
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-4 text-sm font-mono tracking-wider transition-colors ${activeTab === "details" ? "text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/5" : "text-gray-400 hover:bg-white/5"}`}
                  >
                    PARAMETERS
                  </button>
                  <button 
                    onClick={() => setActiveTab("media")}
                    className={`flex-1 py-4 text-sm font-mono tracking-wider transition-colors ${activeTab === "media" ? "text-neon-magenta border-b-2 border-neon-magenta bg-neon-magenta/5" : "text-gray-400 hover:bg-white/5"}`}
                  >
                    HOLOGRAM & MEDIA
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                  {activeTab === "details" ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Asset Designation</label>
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all" placeholder="NeuralSync Headset" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Value (USD)</label>
                          <input value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} type="number" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all" placeholder="299.00" />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Initial Stock</label>
                          <input value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} type="number" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all" placeholder="10" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all">
                          <option value="Gaming">Gaming</option>
                          <option value="Sneakers">Sneakers</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Watches">Watches</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Specification File (Description)</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all" placeholder="Enter technical specifications..." />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <label className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        {previewImageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={previewImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" />
                        )}
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                          <ImageIcon className="w-8 h-8 text-neon-cyan" />
                        </div>
                        <p className="font-display text-white mb-1 relative z-10">{imageFile ? imageFile.name : "2D Asset Upload"}</p>
                        <p className="text-xs font-mono text-gray-500 relative z-10">PNG, JPG up to 10MB</p>
                      </label>

                      <label className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-neon-magenta/50 hover:bg-neon-magenta/5 transition-all cursor-pointer group relative overflow-hidden">
                        <input type="file" accept=".glb,.gltf" onChange={handleModelChange} className="hidden" />
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                          <UploadCloud className="w-8 h-8 text-neon-magenta" />
                        </div>
                        <p className="font-display text-white mb-1 relative z-10">{modelFile ? modelFile.name : "Holographic Payload (.GLB)"}</p>
                        <p className="text-xs font-mono text-gray-500 relative z-10">3D Asset up to 50MB</p>
                      </label>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-white/10 bg-black/20">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg bg-white text-space-900 font-bold tracking-widest relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> {uploadProgress}</>
                      ) : (
                        "INITIALIZE ASSET"
                      )}
                    </span>
                    {!isSubmitting && <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-white to-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
                  </button>
                </div>
              </div>

              {/* Right Side: 3D Preview Showroom */}
              <div className="w-1/2 relative bg-[#050505]">
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-neon-cyan border border-white/10">
                    LIVE PREVIEW
                  </span>
                </div>
                
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} color="#00f0ff" />
                  <spotLight position={[-5, -5, -5]} angle={0.15} penumbra={1} intensity={2} color="#ff00aa" />
                  
                  <PresentationControls
                    global
                    snap={true}
                    rotation={[0, 0.3, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                  >
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                      {previewModelUrl ? (
                        <Suspense fallback={
                          <mesh>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial wireframe color="#00f0ff" />
                          </mesh>
                        }>
                          <ModelPreview url={previewModelUrl} />
                        </Suspense>
                      ) : (
                        <mesh>
                          <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />
                          <meshPhysicalMaterial 
                            color="#ffffff" 
                            metalness={1} 
                            roughness={0.1} 
                            clearcoat={1} 
                            emissive="#00f0ff"
                            emissiveIntensity={0.2}
                          />
                        </mesh>
                      )}
                    </Float>
                  </PresentationControls>
                  
                  <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                  <Environment preset="city" />
                </Canvas>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
