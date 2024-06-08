import { useRef, useState } from "react";
import firebaseApp from "../../lib/firebase.ts";
import Modal from "./common";
import { FiUpload } from "react-icons/fi";
import style from "./modal.module.scss";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import ImageUpload from "../../pages/imageUpload.tsx";

function PhotoUploadModal() {
    const [page, setPage] = useState(1);
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
    const [name, setName] = useState('');
    const router = useNavigate();
    const [imageUpload, setImageUpload] = useState<File | null>(null);
    const [imageList, setImageList] = useState<string[]>([]);

    const storage = getStorage(firebaseApp);

    const handleFileRegister = () => {
        if (inputRef.current && inputRef.current.files) {
            const file = inputRef.current.files[0];
            setFile(file);
            setImageUpload(file);
            console.log(ImageUpload);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreview(reader.result);
            }
            setPage(2);
        }
    }

    const handleUpload = () => {
        const imageRef = ref(storage, `image${imageUpload.name}/${imageUpload.name}`);
        console.log(imageUpload);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageList((prev) => [...prev, url]);
            });
        });

        alert('업로드 완료');
        router('/')

    }

    return (
        <Modal.Backdrop>
            <Modal>
                <Modal.Top icon={<FiUpload />} color="#2fcc88">사진 업로드</Modal.Top>
                {
                    page === 1 && (
                        <>
                            <input type="file" name="file" id="file" ref={inputRef} className={style.fileInput} onChange={() => handleFileRegister()} accept="image/*" />
                            <label htmlFor="file" className={style.submit}>사진 선택하기</label>
                        </>
                    )
                }
                {
                    page === 2 && (
                        <>
                            <div className={style.previewContainer}>
                                <img src={preview as string} alt="preview" className={style.preview} />
                            </div>
                            <div style={{ marginTop: '20px' }}/>
                            <label htmlFor="file" className={style.label}>사진 이름</label>
                            <input type="text" placeholder="사진 이름" onChange={(e) => setName(e.target.value)} className={style.input} />
                            <button className={style.submit} onClick={() => handleUpload()} disabled={name === ''}>업로드</button>
                        </>
                    )
                }
            </Modal>
        </Modal.Backdrop>
    );
}

export default PhotoUploadModal;
