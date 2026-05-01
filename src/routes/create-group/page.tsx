import {useState} from "react";
import {Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTrigger} from "@/components/ui/stepper.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {Step1} from "@/routes/create-group/forms/step1.tsx";
import {Step2} from "@/routes/create-group/forms/step2.tsx";
import {MoveLeft, MoveRight} from "lucide-react";
import {logger} from "@/lib/logger.ts";

const steps = [1, 2, 3, 4];
const log = logger.child("create-group")

export default function CreateGroup() {
    const [currentStep, setCurrentStep] = useState(1);

    // Use shouldUnregister: false to keep values of unmounted fields
    const methods = useForm({
        shouldUnregister: false,
        mode: "all"
    });

    const onSubmit = (data: FieldValues) => {
        log.debug("submitted", {data})
    };

    return (
        <div className={"mt-6 flex max-w-6xl flex-col gap-4"}>
            <h1 className={"flex flex-row items-center gap-2 text-3xl font-bold"}>Create your group</h1>

            {/* Stepper */}
            <div className="space-y-8">
                <Stepper value={currentStep} onValueChange={setCurrentStep}>
                    {steps.map((step) => (
                        <StepperItem key={step} step={step} className="not-last:flex-1">
                            <StepperTrigger asChild>
                                <StepperIndicator/>
                            </StepperTrigger>
                            {step < steps.length && <StepperSeparator/>}
                        </StepperItem>
                    ))}
                </Stepper>

                {/* Content here */}
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className={"max-w-xl"}>
                        {/* Render components conditionally based on current step */}
                        {currentStep === 1 && <Step1/>}
                        {currentStep === 2 && <Step2/>}
                    </form>
                </FormProvider>

                {/*--------------*/}

                <div className="flex space-x-4">
                    <Button
                        variant="outline"
                        className="w-32"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        disabled={currentStep === 1}
                    >
                        {currentStep !== 1 && <MoveLeft/>}
                        Prev step
                    </Button>
                    <Button
                        variant="outline"
                        className="w-32"
                        onClick={() => setCurrentStep((prev) => prev + 1)}
                        disabled={currentStep >= steps.length}
                    >
                        Next step
                        {currentStep < steps.length && <MoveRight/>}
                    </Button>
                </div>
            </div>

            {/*<Alert>*/}
            {/*    <Info className="h-4 w-4"/>*/}
            {/*    <AlertTitle>Note</AlertTitle>*/}

            {/*    <AlertDescription className={"text-muted-foreground"}>Groups can also be nested by creating*/}
            {/*        subgroups.</AlertDescription>*/}
            {/*</Alert>*/}
            {/*<Separator/>*/}
            {/*<CreateGroupForm/>*/}
        </div>

    )
}
