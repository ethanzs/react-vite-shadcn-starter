import {useFormContext} from "react-hook-form";

export function Step2() {
    const {
        register,
        formState: {errors}
    } = useFormContext();

    return (
        <div>
            <h2>Step 2: Personal Information</h2>
            <label>Name:</label>
            <input {...register('name', {required: 'Name is required'})} />
            {errors.name && <p>{String(errors.name.message)}</p>}
        </div>
    );
};
