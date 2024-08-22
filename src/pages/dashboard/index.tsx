import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { useEffect, useState, useContext } from "react";
import {FiTrash2} from 'react-icons/fi'

import {db, storage} from "../../services/firebaseConnection"
import { collection, query, getDocs, where, doc, deleteDoc } from "firebase/firestore";
import {AuthContext} from '../../contexts/AuthContext'
import {ref, deleteObject} from 'firebase/storage'

interface CarProps{
id: string;
name: string;
year: string;
km: string;
uid: string;
price: string | number;
city: string;
images: ImageCarProps[];
}

interface ImageCarProps{
name: string;
url: string;
uid: string;
}

export function Dashboard() {
const [cars, setCars] = useState<CarProps[]>([]);
const {user} = useContext(AuthContext);

useEffect(() => {
    async function loadCars(){
        if(!user?.uid){
            return;
        }

        const carsRef = collection(db, "cars")
        const queryRef = query(carsRef, where("uid", "==", user.uid))
        
        getDocs(queryRef)
        .then((snapshot)=>{

        let listCars = [] as CarProps[];

        snapshot.forEach((doc)=>{
            listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            uid: doc.data().uid,
            km: doc.data().km,
            price: doc.data().price,
            city: doc.data().city,
            images: doc.data().images
            })
        })
        setCars(listCars)
        })
    }

    loadCars();

    }, [user])


async function handleDeleteCar(car: CarProps){
    const itemCar = car;

    const docRef = doc(db, "cars", itemCar.id)
    await deleteDoc(docRef);

    itemCar.images.map(async(image) => {
        const imagePath = `images/${image.uid}/${image.name}`
        const imageRef = ref(storage, imagePath)
        
        try{
        await deleteObject(imageRef)
        setCars(cars.filter(car => car.id ! == itemCar.id))

        }catch(err){
            console.log(err)
        }
    })

    
} 


return (    
    <Container>
<DashboardHeader/>

<main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {cars.map( car => (
            <section className="w-full bg-white rounded-lg relative">

            <button 
            onClick={() => {handleDeleteCar(car)}}
            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow-sm"
            >
                <FiTrash2 size={26} color="#000" />
            </button>
            <img
            className="w-full rounded-lg mb-2 max-h-70"
            src={car.images[0].url} 
            />
            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

            <div className="flex flex-col px-2 ">
                <span className="text-zinc-700">
                    {car.year}   | {car.km}
                </span>
                <strong className="text-black font-bold mt-4">
                    {car.price}
                </strong>

                <div className="w-full h-px bg-gray-200 my-2">
                <div className="px-2 pb-2">
                    <span className="text-black">
                        {car.city}
                    </span>
                </div>
                </div>
            </div>
            
            
        </section>
    ))}
</main>

</Container>
)
}

























