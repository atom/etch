const fs =  require('fs')
import {SVG_TAGS} from '../svg-tags'
import {HTML_TAGS} from '../html-tags'

function EtchDOM_codegen(){
    let file = "EtchDOM_codegen.txt"
    fs.open(file, "w", (err: Error, fd :number) => {
        if (err) throw err;
        for (const tag of HTML_TAGS) {
            fs.appendFile(file,  `  ${tag}: EtchCreateElement<"${tag}", JSX.IntrinsicElements["${tag}"]>\n`, (err :Error) => {if (err) throw err;})
        }
        for (const tag of SVG_TAGS) {
            fs.appendFile(file,  `  ${tag}: EtchCreateElement<"${tag}", JSX.IntrinsicElements["${tag}"]>\n`, (err :Error) => {if (err) throw err;})
        }
        fs.close(fd, (err :Error) => {if (err) throw err;})
    })
}

EtchDOM_codegen()


function JSX_codegen(){
    let file = "JSX_codegen.txt"
    fs.open(file, "w", (err: Error, fd :number) => {
        if (err) throw err;
        for (const tag of HTML_TAGS) {
            fs.appendFile(file,`      ${tag}: any\n`, (err :Error) => {if (err) throw err;})
        }
        for (const tag of SVG_TAGS) {
            fs.appendFile(file,  `      ${tag}: any\n`, (err :Error) => {if (err) throw err;})
        }
        fs.close(fd, (err :Error) => {if (err) throw err;})
    })
}

JSX_codegen()
