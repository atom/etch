const fs =  require('fs')
import {SVG_TAGS} from './svg-tags'
import {HTML_TAGS} from './html-tags'

function dom_codegen(){
    let file = "dom_codegen.txt"
    fs.open(file, "w", (err: Error, fd :number) => {
        if (err) throw err;
        for (const tag of HTML_TAGS) {
            fs.appendFile(file,  `  ${tag}: EtchCreateElement<"${tag}", any>\n`, (err :Error) => {if (err) throw err;})
        }
        for (const tag of SVG_TAGS) {
            fs.appendFile(file,  `  ${tag}: EtchCreateElement<"${tag}", any>\n`, (err :Error) => {if (err) throw err;})
        }
        fs.close(fd, (err :Error) => {if (err) throw err;})
    })
}

dom_codegen()
