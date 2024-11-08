export default function ExcerciseInfo({ name, details }) {

    return (
        <>
        <h2 className="font-bold">{name}</h2>
        <p>
            {details}
        </p>
        </>
    )

}