<span
    class={className}
    onClick={() => {
        navigator.clipboard.writeText(text);
        alert(`Copied ${text} to your clipboard.`);
        // toast
        // toast.success(`Copied ${text} to your clipboard.`, {
        //   position: "bottom-left",
        //   autoClose: 2000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        // });
    }}
>
    {text}
</span>