import { Proveedor } from "@/lib/queries";
import { createPaginatedResponse } from "@/utils";
import { chunk } from "lodash";
import { NextPageContext } from "next";
import { NextRequest, NextResponse, URLPattern } from "next/server";
import { ServerContext } from "react";

const proveedores: Proveedor[] = [
    {
        "id": 1,
        "nombre": "Insurance, Inc.",
        "contacto": "Brittany",
        "telefono": "959-162-2381",
        "email": "brittanythomas@live.com",
        "direccion": "57 Clinton Street"
    },
    {
        "id": 2,
        "nombre": "Nanotechnology, Inc.",
        "contacto": "Julian",
        "telefono": "903-838-3182",
        "email": "j_r_lewis@rocketmail.com",
        "direccion": "187 Main Street North"
    },
    {
        "id": 3,
        "nombre": "Wine Co.",
        "contacto": "Allison",
        "telefono": "828-402-9749",
        "email": "arsanchez@gmail.com",
        "direccion": "615 Pearl Street"
    },
    {
        "id": 4,
        "nombre": "Food Production Corp.",
        "contacto": "Michelle",
        "telefono": "267-479-2047",
        "email": "m.a.alexander87@gmail.com",
        "direccion": "98 5th Street"
    },
    {
        "id": 5,
        "nombre": "Network Security, Inc.",
        "contacto": "Nicole",
        "telefono": "574-279-2525",
        "email": "n_parker@live.com",
        "direccion": "77 Jefferson Avenue"
    },
    {
        "id": 6,
        "nombre": "Construction, LLC",
        "contacto": "Sophia",
        "telefono": "740-860-8397",
        "email": "sophia.r.sanchez@rocketmail.com",
        "direccion": "62 Hillcrest Drive"
    },
    {
        "id": 7,
        "nombre": "Ceramics, LLC",
        "contacto": "Jose",
        "telefono": "612-582-1789",
        "email": "josedmurphy@rocketmail.com",
        "direccion": "844 Belmont Avenue"
    },
    {
        "id": 8,
        "nombre": "Transportation, Ltd.",
        "contacto": "Brian",
        "telefono": "213-238-3158",
        "email": "brian.joseph@outlook.com",
        "direccion": "79 Oak Lane"
    },
    {
        "id": 9,
        "nombre": "Utilities, Ltd.",
        "contacto": "Amber",
        "telefono": "641-323-6523",
        "email": "aparker@hotmail.com",
        "direccion": "2080 Surrey Lane"
    },
    {
        "id": 10,
        "nombre": "International Development, Ltd.",
        "contacto": "Julian",
        "telefono": "318-594-7235",
        "email": "julianleeking@hotmail.com",
        "direccion": "97056 Cherry Street"
    },
    {
        "id": 11,
        "nombre": "Fitness Co.",
        "contacto": "Samuel",
        "telefono": "517-173-5288",
        "email": "samuel_gray@rocketmail.com",
        "direccion": "560 Church Street"
    },
    {
        "id": 12,
        "nombre": "Apparel, Incorporated",
        "contacto": "Dylan",
        "telefono": "927-331-5758",
        "email": "dylan.jones@live.com",
        "direccion": "76 2nd Avenue"
    },
    {
        "id": 13,
        "nombre": "Information Technology Corp.",
        "contacto": "Olivia",
        "telefono": "706-157-5050",
        "email": "oliviareed90@hotmail.com",
        "direccion": "76974 Railroad Street"
    },
    {
        "id": 14,
        "nombre": "Computer Games Corp.",
        "contacto": "Lauren",
        "telefono": "779-591-8750",
        "email": "l.baker@live.com",
        "direccion": "9 Walnut Street"
    },
    {
        "id": 15,
        "nombre": "Design, LLC",
        "contacto": "Katherine",
        "telefono": "505-135-3657",
        "email": "k.n@ymail.com",
        "direccion": "168 Durham Road"
    },
    {
        "id": 16,
        "nombre": "Printing, Ltd.",
        "contacto": "Oliver",
        "telefono": "318-869-2322",
        "email": "oliver_j_perry17@aol.com",
        "direccion": "880 Route 6"
    },
    {
        "id": 17,
        "nombre": "Leisure, Incorporated",
        "contacto": "Anna",
        "telefono": "610-461-8907",
        "email": "anna.ruth.miller84@live.com",
        "direccion": "89 4th Street"
    },
    {
        "id": 18,
        "nombre": "Electrical Manufacturing, Incorporated",
        "contacto": "Rachel",
        "telefono": "253-408-4395",
        "email": "r_r_reed@rocketmail.com",
        "direccion": "927 4th Street North"
    },
    {
        "id": 19,
        "nombre": "Facilities Services Corp.",
        "contacto": "Kimberly",
        "telefono": "520-049-4149",
        "email": "k_butler@gmail.com",
        "direccion": "2643 2nd Street West"
    },
    {
        "id": 20,
        "nombre": "Defense, LLC",
        "contacto": "Charlotte",
        "telefono": "912-928-8103",
        "email": "c_l@rocketmail.com",
        "direccion": "74295 5th Street"
    },
    {
        "id": 21,
        "nombre": "The Electrical Manufacturing Company",
        "contacto": "Samuel",
        "telefono": "307-895-5908",
        "email": "samuel_allen@live.com",
        "direccion": "1279 Oak Lane"
    },
    {
        "id": 22,
        "nombre": "The Network Security Company",
        "contacto": "Sara",
        "telefono": "315-909-5220",
        "email": "s.turner@hotmail.com",
        "direccion": "43425 Franklin Avenue"
    },
    {
        "id": 23,
        "nombre": "Space, Incorporated",
        "contacto": "Hannah",
        "telefono": "278-303-9881",
        "email": "h_morris@outlook.com",
        "direccion": "204 Front Street"
    },
    {
        "id": 24,
        "nombre": "Architecture, Ltd.",
        "contacto": "Heather",
        "telefono": "813-534-7587",
        "email": "h_r_morris@hotmail.com",
        "direccion": "94398 Park Drive"
    },
    {
        "id": 25,
        "nombre": "Shipbuilding Co.",
        "contacto": "Kelsey",
        "telefono": "606-928-6795",
        "email": "krrobinson@rocketmail.com",
        "direccion": "69 Grant Street"
    },
    {
        "id": 26,
        "nombre": "Art, Ltd.",
        "contacto": "Jeremy",
        "telefono": "229-816-5743",
        "email": "jeremy_bennett@outlook.com",
        "direccion": "262 3rd Avenue"
    },
    {
        "id": 27,
        "nombre": "Nanotechnology, Ltd.",
        "contacto": "Eric",
        "telefono": "913-665-5585",
        "email": "ericroberttorres@live.com",
        "direccion": "992 Park Place"
    },
    {
        "id": 28,
        "nombre": "Events Services Co.",
        "contacto": "Theodore",
        "telefono": "216-787-6579",
        "email": "theodore.j.foster@live.com",
        "direccion": "816 Magnolia Drive"
    },
    {
        "id": 29,
        "nombre": "Advertising, Ltd.",
        "contacto": "Jason",
        "telefono": "910-187-4971",
        "email": "j.lopez@hotmail.com",
        "direccion": "14818 Park Drive"
    },
    {
        "id": 30,
        "nombre": "Wireless Corp.",
        "contacto": "Rebecca",
        "telefono": "979-522-0432",
        "email": "rebecca_m_johnson48@live.com",
        "direccion": "86 Railroad Street"
    },
    {
        "id": 31,
        "nombre": "Mortgages, Ltd.",
        "contacto": "Amber",
        "telefono": "856-184-6936",
        "email": "a_m_morris@gmail.com",
        "direccion": "89 Route 30"
    },
    {
        "id": 32,
        "nombre": "Aviation, Incorporated",
        "contacto": "Audrey",
        "telefono": "901-108-6431",
        "email": "afjohnson@outlook.com",
        "direccion": "52 Division Street"
    },
    {
        "id": 33,
        "nombre": "Logistics, Incorporated",
        "contacto": "Megan",
        "telefono": "585-325-4367",
        "email": "megan@gmail.com",
        "direccion": "154 8th Street"
    },
    {
        "id": 34,
        "nombre": "Motion Pictures, LLC",
        "contacto": "Austin",
        "telefono": "914-535-8291",
        "email": "a.scott@ymail.com",
        "direccion": "87168 Valley Road"
    },
    {
        "id": 35,
        "nombre": "Beverages Co.",
        "contacto": "Nathan",
        "telefono": "936-977-9989",
        "email": "nathan_m_collins@live.com",
        "direccion": "25521 Spring Street"
    },
    {
        "id": 36,
        "nombre": "Jewelry Co.",
        "contacto": "Amelia",
        "telefono": "205-317-9728",
        "email": "amelia.robinson@rocketmail.com",
        "direccion": "146 Prospect Avenue"
    },
    {
        "id": 37,
        "nombre": "Computer Engineering Co.",
        "contacto": "Austin",
        "telefono": "609-883-3220",
        "email": "austin.cook@hotmail.com",
        "direccion": "38523 College Street"
    },
    {
        "id": 38,
        "nombre": "Wireless, Ltd.",
        "contacto": "Emily",
        "telefono": "401-716-3899",
        "email": "emily.renee@rocketmail.com",
        "direccion": "6015 Surrey Lane"
    },
    {
        "id": 39,
        "nombre": "The Human Resources Company",
        "contacto": "Lauren",
        "telefono": "413-448-0513",
        "email": "lswood@hotmail.com",
        "direccion": "43 Hickory Lane"
    },
    {
        "id": 40,
        "nombre": "Wholesale Corp.",
        "contacto": "Christina",
        "telefono": "501-023-6790",
        "email": "c_r_long@gmail.com",
        "direccion": "21 Warren Street"
    },
    {
        "id": 41,
        "nombre": "Printing, Ltd.",
        "contacto": "Stephen",
        "telefono": "248-844-7986",
        "email": "s.wood@live.com",
        "direccion": "18799 Pleasant Street"
    },
    {
        "id": 42,
        "nombre": "The Insurance Company",
        "contacto": "Sara",
        "telefono": "602-278-2936",
        "email": "s.a@ymail.com",
        "direccion": "351 Academy Street"
    },
    {
        "id": 43,
        "nombre": "Aviation, Ltd.",
        "contacto": "Nicole",
        "telefono": "927-258-5678",
        "email": "n_a_garcia@gmail.com",
        "direccion": "71 Heather Lane"
    },
    {
        "id": 44,
        "nombre": "Ceramics Co.",
        "contacto": "Timothy",
        "telefono": "917-265-8046",
        "email": "ttorres@aol.com",
        "direccion": "564 3rd Avenue"
    },
    {
        "id": 45,
        "nombre": "The Insurance Company",
        "contacto": "Alyssa",
        "telefono": "816-013-3560",
        "email": "a_hall@aol.com",
        "direccion": "72650 North Street"
    },
    {
        "id": 46,
        "nombre": "The Mortgages Company",
        "contacto": "Aaron",
        "telefono": "949-048-3313",
        "email": "a.morgan@ymail.com",
        "direccion": "65 Walnut Avenue"
    },
    {
        "id": 47,
        "nombre": "Information Technology, Ltd.",
        "contacto": "Timothy",
        "telefono": "541-753-6977",
        "email": "t.j.mitchell@hotmail.com",
        "direccion": "736 Primrose Lane"
    },
    {
        "id": 48,
        "nombre": "Graphic Design Corp.",
        "contacto": "Christopher",
        "telefono": "479-693-7452",
        "email": "c.e25@outlook.com",
        "direccion": "82138 Clinton Street"
    },
    {
        "id": 49,
        "nombre": "Sports, Ltd.",
        "contacto": "Alexander",
        "telefono": "212-618-9848",
        "email": "alexander.andrew.ross@aol.com",
        "direccion": "999 Pleasant Street"
    },
    {
        "id": 50,
        "nombre": "Journalism, Inc.",
        "contacto": "Kyle",
        "telefono": "954-845-0542",
        "email": "kyle_joseph_smith37@yahoo.com",
        "direccion": "85813 Chestnut Street"
    },
    {
        "id": 51,
        "nombre": "Pharmaceuticals Corp.",
        "contacto": "Samuel",
        "telefono": "412-003-3127",
        "email": "s_baker@ymail.com",
        "direccion": "99 7th Street East"
    },
    {
        "id": 52,
        "nombre": "Telecommunications, Inc.",
        "contacto": "Adam",
        "telefono": "702-229-9644",
        "email": "a.r.price@gmail.com",
        "direccion": "1794 4th Street"
    },
    {
        "id": 53,
        "nombre": "The Construction Company",
        "contacto": "Sofia",
        "telefono": "859-408-8280",
        "email": "sofia.lewis@aol.com",
        "direccion": "3 6th Street North"
    },
    {
        "id": 54,
        "nombre": "Energy Co.",
        "contacto": "Oliver",
        "telefono": "763-570-5182",
        "email": "oliverbaker@ymail.com",
        "direccion": "2828 School Street"
    },
    {
        "id": 55,
        "nombre": "Fashion, Inc.",
        "contacto": "Joshua",
        "telefono": "917-016-6539",
        "email": "j_gray@live.com",
        "direccion": "81 Brookside Drive"
    },
    {
        "id": 56,
        "nombre": "Computer Hardware, Incorporated",
        "contacto": "Haley",
        "telefono": "609-059-5886",
        "email": "haley.m.white26@hotmail.com",
        "direccion": "197 Surrey Lane"
    },
    {
        "id": 57,
        "nombre": "The Metals Company",
        "contacto": "Lauren",
        "telefono": "832-746-9482",
        "email": "lrperry@hotmail.com",
        "direccion": "21203 Summit Street"
    },
    {
        "id": 58,
        "nombre": "Motion Pictures Corp.",
        "contacto": "John",
        "telefono": "315-036-0701",
        "email": "johnmatthewevans@rocketmail.com",
        "direccion": "52142 Lincoln Street"
    },
    {
        "id": 59,
        "nombre": "Consumer Services Corp.",
        "contacto": "Robert",
        "telefono": "530-740-4182",
        "email": "robertadams@aol.com",
        "direccion": "8081 Summit Street"
    },
    {
        "id": 60,
        "nombre": "Dairy Co.",
        "contacto": "Olivia",
        "telefono": "505-313-4162",
        "email": "olivia.l@live.com",
        "direccion": "29 2nd Street East"
    },
    {
        "id": 61,
        "nombre": "The Writing Company",
        "contacto": "Dylan",
        "telefono": "325-072-7034",
        "email": "dylan.alan.cox@yahoo.com",
        "direccion": "93 Route 29"
    },
    {
        "id": 62,
        "nombre": "Chemicals Corp.",
        "contacto": "Jessica",
        "telefono": "957-458-3433",
        "email": "jessica@live.com",
        "direccion": "2 Park Street"
    },
    {
        "id": 63,
        "nombre": "Dairy, LLC",
        "contacto": "Danielle",
        "telefono": "334-532-4429",
        "email": "danielle73@outlook.com",
        "direccion": "98 Pleasant Street"
    },
    {
        "id": 64,
        "nombre": "The Business Supplies Company",
        "contacto": "Olivia",
        "telefono": "816-201-8345",
        "email": "o.e.phillips@live.com",
        "direccion": "5 Cherry Street"
    },
    {
        "id": 65,
        "nombre": "Leisure, Incorporated",
        "contacto": "Oliver",
        "telefono": "480-572-9684",
        "email": "oliver_alan_russell@hotmail.com",
        "direccion": "827 Walnut Avenue"
    },
    {
        "id": 66,
        "nombre": "Wholesale, Inc.",
        "contacto": "Stephanie",
        "telefono": "985-862-8741",
        "email": "s.k@aol.com",
        "direccion": "361 Woodland Drive"
    },
    {
        "id": 67,
        "nombre": "The Wine Company",
        "contacto": "Amelia",
        "telefono": "478-696-3009",
        "email": "am18@yahoo.com",
        "direccion": "66 8th Street"
    },
    {
        "id": 68,
        "nombre": "Shipbuilding, Inc.",
        "contacto": "Sara",
        "telefono": "734-799-4057",
        "email": "s_cooper@live.com",
        "direccion": "47005 Broad Street"
    },
    {
        "id": 69,
        "nombre": "Internet Corp.",
        "contacto": "Brian",
        "telefono": "712-791-2270",
        "email": "bhoward@outlook.com",
        "direccion": "919 Adams Street"
    },
    {
        "id": 70,
        "nombre": "Fashion, Ltd.",
        "contacto": "Mark",
        "telefono": "747-404-5294",
        "email": "mark@rocketmail.com",
        "direccion": "94 Pennsylvania Avenue"
    },
    {
        "id": 71,
        "nombre": "The Utilities Company",
        "contacto": "David",
        "telefono": "828-872-4941",
        "email": "david.scott.watson@yahoo.com",
        "direccion": "46704 Clinton Street"
    },
    {
        "id": 72,
        "nombre": "Design, Incorporated",
        "contacto": "Christina",
        "telefono": "541-577-2109",
        "email": "c_f_cox@gmail.com",
        "direccion": "78 Cherry Street"
    },
    {
        "id": 73,
        "nombre": "Mechanical Engineering, Incorporated",
        "contacto": "Owen",
        "telefono": "318-394-3703",
        "email": "owen@yahoo.com",
        "direccion": "3772 Oak Lane"
    },
    {
        "id": 74,
        "nombre": "The Industrial Engineering Company",
        "contacto": "Brandon",
        "telefono": "651-481-8224",
        "email": "b_j_howard@ymail.com",
        "direccion": "1478 5th Street West"
    },
    {
        "id": 75,
        "nombre": "Industrial Automation, Inc.",
        "contacto": "Mark",
        "telefono": "804-330-5610",
        "email": "mwadams54@aol.com",
        "direccion": "82883 Water Street"
    },
    {
        "id": 76,
        "nombre": "Web Design, Inc.",
        "contacto": "Erin",
        "telefono": "501-321-3481",
        "email": "e.m@hotmail.com",
        "direccion": "263 Walnut Street"
    },
    {
        "id": 77,
        "nombre": "Facilities Services, Incorporated",
        "contacto": "Melissa",
        "telefono": "305-757-7118",
        "email": "m_foster@gmail.com",
        "direccion": "4053 Fairway Drive"
    },
    {
        "id": 78,
        "nombre": "Graphic Design, Ltd.",
        "contacto": "Isaac",
        "telefono": "772-715-1373",
        "email": "i.r.clark81@aol.com",
        "direccion": "36 George Street"
    },
    {
        "id": 79,
        "nombre": "Financial Services Co.",
        "contacto": "Thomas",
        "telefono": "510-738-1110",
        "email": "thomas.m.hall@outlook.com",
        "direccion": "6015 Magnolia Drive"
    },
    {
        "id": 80,
        "nombre": "Farming, LLC",
        "contacto": "Joseph",
        "telefono": "507-495-3852",
        "email": "j.bell4@ymail.com",
        "direccion": "486 Summit Street"
    },
    {
        "id": 81,
        "nombre": "Design Co.",
        "contacto": "Danielle",
        "telefono": "425-982-5465",
        "email": "danielle.rose.torres@yahoo.com",
        "direccion": "84 7th Street"
    },
    {
        "id": 82,
        "nombre": "Package Delivery, LLC",
        "contacto": "Lauren",
        "telefono": "276-567-3807",
        "email": "lm@aol.com",
        "direccion": "87 Church Street"
    },
    {
        "id": 83,
        "nombre": "Entertainment, Inc.",
        "contacto": "Henry",
        "telefono": "469-910-4336",
        "email": "henryedwards@aol.com",
        "direccion": "4 Church Road"
    },
    {
        "id": 84,
        "nombre": "Translation, Inc.",
        "contacto": "Andrew",
        "telefono": "765-476-4428",
        "email": "ajohnson@ymail.com",
        "direccion": "977 Front Street"
    },
    {
        "id": 85,
        "nombre": "Fashion, Inc.",
        "contacto": "Olivia",
        "telefono": "908-692-1538",
        "email": "o.l.baker@hotmail.com",
        "direccion": "26 Creek Road"
    },
    {
        "id": 86,
        "nombre": "International Development, Inc.",
        "contacto": "Matthew",
        "telefono": "574-898-1334",
        "email": "matthew.g@live.com",
        "direccion": "9476 Colonial Drive"
    },
    {
        "id": 87,
        "nombre": "Space, Ltd.",
        "contacto": "Michael",
        "telefono": "810-422-7787",
        "email": "m_allen95@live.com",
        "direccion": "68803 Penn Street"
    },
    {
        "id": 88,
        "nombre": "Automotive, LLC",
        "contacto": "John",
        "telefono": "636-133-9100",
        "email": "john.hall@gmail.com",
        "direccion": "70 Route 1"
    },
    {
        "id": 89,
        "nombre": "Legal Services, LLC",
        "contacto": "Kyle",
        "telefono": "936-302-0746",
        "email": "kylejameslopez@rocketmail.com",
        "direccion": "68 Creek Road"
    },
    {
        "id": 90,
        "nombre": "Journalism, Inc.",
        "contacto": "Patrick",
        "telefono": "718-675-3488",
        "email": "pbrown@live.com",
        "direccion": "1182 George Street"
    },
    {
        "id": 91,
        "nombre": "Media Production, Incorporated",
        "contacto": "Michelle",
        "telefono": "931-617-2815",
        "email": "mallen@outlook.com",
        "direccion": "38953 Dogwood Drive"
    },
    {
        "id": 92,
        "nombre": "Professional Training Corp.",
        "contacto": "Christopher",
        "telefono": "309-022-2172",
        "email": "christopherfjackson@live.com",
        "direccion": "606 Mill Road"
    },
    {
        "id": 93,
        "nombre": "The Medical Equipment Company",
        "contacto": "Julian",
        "telefono": "857-571-8945",
        "email": "julian@hotmail.com",
        "direccion": "3334 Hamilton Street"
    },
    {
        "id": 94,
        "nombre": "Fitness, Ltd.",
        "contacto": "Jack",
        "telefono": "303-584-4677",
        "email": "j_moore@aol.com",
        "direccion": "5782 Valley Road"
    },
    {
        "id": 95,
        "nombre": "Pharmaceuticals, Incorporated",
        "contacto": "Kyle",
        "telefono": "760-600-2878",
        "email": "kprice@live.com",
        "direccion": "9082 Water Street"
    },
    {
        "id": 96,
        "nombre": "Biotechnology, LLC",
        "contacto": "Christina",
        "telefono": "484-250-2556",
        "email": "c_scott73@aol.com",
        "direccion": "56129 Central Avenue"
    },
    {
        "id": 97,
        "nombre": "Printing, LLC",
        "contacto": "Brittany",
        "telefono": "706-926-2492",
        "email": "b.n.price46@yahoo.com",
        "direccion": "48 Berkshire Drive"
    },
    {
        "id": 98,
        "nombre": "Ceramics, LLC",
        "contacto": "Lillian",
        "telefono": "936-438-7637",
        "email": "l_d_henderson@live.com",
        "direccion": "91816 Madison Avenue"
    },
    {
        "id": 99,
        "nombre": "Fashion, Ltd.",
        "contacto": "Heather",
        "telefono": "629-690-1005",
        "email": "hjames@yahoo.com",
        "direccion": "631 Locust Street"
    },
    {
        "id": 100,
        "nombre": "Business Equipment, LLC",
        "contacto": "Aiden",
        "telefono": "904-523-8991",
        "email": "a_r@aol.com",
        "direccion": "50126 Poplar Street"
    }
]

export async function GET(request: NextRequest, context = {}) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    /** Aquí va la consulta a la base de datos */
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = proveedores.slice(startIndex, endIndex);
    /** Aquí va la consulta a la base de datos */

    return NextResponse.json(createPaginatedResponse(paginatedRecords, page, limit, proveedores.length));
}